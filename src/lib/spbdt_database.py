import psycopg2
import psycopg2.extras
from psycopg2 import OperationalError,InterfaceError
class SPBDTDatabase():
    def __init__(self, settings):
        # self.settings = settings
        self._db = None
        self.initDb()
        # self.logger = None
        self.replace_var = "%s"
        # self.returning = "RETURNING id"

    def initDb(self):
        self._db = psycopg2.connect(host='127.0.0.1', 
                                    database='spbdt', 
                                    user='postgres', 
                                    password='masterkey',
                                    port='5432')
        psycopg2.extras.register_default_json(loads=lambda x: x)
        # try:
        #     if self.settings.ISOLATIONLVL:
        #         lvl = 'ISOLATION_LEVEL_' + self.settings.ISOLATIONLVL
        #         if hasattr(psycopg2.extensions, lvl):
        #             self._db.set_isolation_level(getattr(psycopg2.extensions, lvl))
        #         else:
        #             #raise Exception('Isolation level %s not supported.' % lvl)
        #             self.logger.exception('Isolation level %s not supported.' % lvl)
        # except:
        #     if self.logger:
        #         self.logger.exception("Coould not instanciate isolation levels")
        # # This will always return a string result, even if it is type json
        # # Only for psycopg2 V2.5.4 +
        # try:
        #     psycopg2.extras.register_default_json(loads=lambda x: x)
        # except:
        #     pass

    def setLogger(self, logger):
        self.logger = logger

    def getDatabase(self):
        return self._db

    def getCursor(self):
        db = self.getDatabase()
        try:
            db.isolation_level # Cargo culted! Less resource usage than a 'SELECT 1' query
        except (OperationalError, InterfaceError):
            self.logger.warning("Connection to Database closed. Reconnecting now...")
            try:
                self._db = psycopg2.connect(host=self.settings.DATABASE_HOST, 
                                            database=self.settings.DATABASE_NAME, 
                                            user=self.settings.DATABASE_USER, 
                                            password=self.settings.DATABASE_PASS,
                                            port=self.settings.DATABASE_PORT)
                db = self.getDatabase() # Get new db connection object
            except Exception as ex:
                self.logger.error("Failed to re-establish the db connection: " + str(ex))
                raise Exception("Failed to re-establish the db connection: " + str(ex))        
        if db != None:
            return db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        else:
            return None

    def callFunction(self, func_name, *args):
        cursor = self.getCursor()
        try:
            cursor.callproc(func_name, list(args))
            retval = cursor.fetchall()
            self._commit()
            return retval
        except Exception as ex:
            self._db.rollback()
            raise ex
    
    def callFunctions(self, func_name, func_tuples):
        cursor = self.getCursor()
        results = []
        for args in func_tuples:
            try:
                cursor.callproc(func_name, list(args))
                results.append(cursor.fetchall())
            except:
                self._db.rollback()
                raise Exception("Commit to database failed")
        self._commit()
        return results    

    def insert(self, table_name, column_data_dict, return_id=True):
        value_str = ", ".join(map(str, [self.replace_var]*len(column_data_dict)))
        column_str = ", ".join(map(str, list(column_data_dict.keys())))
        value_tuple = tuple(column_data_dict.values())
        return_str = ""
        if isinstance(return_id, bool):
            return_str = self.returning if return_id else ""
        elif isinstance(return_id, str):
            if "RETURNING" in return_id.upper():
                return_str = return_id
                return_id = return_id.split(" ")[-1]
            else:
                return_str = " RETURNING " + return_id
        query_insert = "INSERT INTO %s (%s) VALUES (%s) %s"%(table_name, column_str, value_str, return_str)
        retval = self._execute(query_insert, value_tuple, return_id)
        return retval

    def selectRaw(self, sql_statement, sql_param_tuple_or_dict):
        cur = self._execute(sql_statement, sql_param_tuple_or_dict)
        return cur.fetchall()

    def executeRaw(self, sql_statement, sql_param_tuple_or_dict):
        result = self._execute(sql_statement, sql_param_tuple_or_dict)
        return True if result is not None else False

    def executeRawWithResult(self, sql_statement, sql_param_tuple_or_dict):
        result = self._execute(sql_statement, sql_param_tuple_or_dict)
        return result.fetchall() if result is not None else False

    def update(self, table_name, column_data_dict, where_field):
        set_str = ", ".join([k + "=" + self.replace_var for k in list(column_data_dict.keys())])
        where_str = where_field + "=" + self.replace_var
        value_tuple = tuple(column_data_dict.values()) + (column_data_dict[where_field],)
        query_insert = "UPDATE %s set %s WHERE %s"%(table_name, set_str, where_str)
        retval = self._execute(query_insert, value_tuple)
        return retval

    def delete(self, table_name, column_match_dict):
        column_str = ""
        if column_match_dict != {}:
            column_str = "=" + self.replace_var + " and "
            column_str = column_str.join(map(str, list(column_match_dict.keys()))) + "=" + self.replace_var
        else:
            raise Exception("column_match_dict cannot be empty")
        query_insert = "DELETE FROM %s WHERE %s" % (table_name, column_str)
        value_tuple = tuple(column_match_dict.values())
        cur = self._execute(query_insert, value_tuple)
        return True

    def select(self, table_name, column_match_dict={}, items="*", staticmatchdict={}, staticmatchops={}, join_match_dict={}, sort_key=None, sort_order="ASC", ilikedict={}, operator="AND", gtdict={}, ltdict={}, dontmatchdict={}, notlikedict={}, items_pp=None, offset=None):

        operator = " %s "%(operator, )
        sort_string = "" if sort_key is None else "ORDER BY %s %s" % (sort_key, sort_order)
        if column_match_dict == {} and join_match_dict == {} and ilikedict == {} and dontmatchdict == {} and notlikedict == {} and staticmatchdict == {}:
            query_insert = "SELECT %s from %s %s"%(items, table_name, sort_string)
            if items_pp != None and offset != None:
                query_insert += " LIMIT %s OFFSET %s"%(items_pp,items_pp*(offset-1))
            cur = self._execute(query_insert)
        else:
            static_operator = ""
            column_str = ""
            static_column_str = ""
            join_str = ""
            if column_match_dict != {}:
                column_str = " =" + self.replace_var + operator
                column_str = column_str.join(map(str, list(column_match_dict.keys()))) + " =" + self.replace_var
            if dontmatchdict != {}:
                if column_str != "":
                    column_str += operator
                column_str += column_str.join(map(str, list(dontmatchdict.keys()))) + "!=" + self.replace_var
            if ilikedict != {}:
                if column_str != "":
                    column_str += operator
                column_str += operator.join(["%s::text ilike "%(k) + self.replace_var for k in ilikedict])
            if notlikedict != {}:
                if column_str != "":
                    column_str += operator
                column_str += operator.join(["NOT %s::text ilike "%(k) + self.replace_var for k in notlikedict])
            if gtdict != {}:
                if column_str != "":
                    column_str += operator
                column_str += operator.join(["%s > "%(k) + self.replace_var for k in gtdict])
            if ltdict != {}:
                if column_str != "":
                    column_str += operator
                column_str += operator.join(["%s < "%(k) + self.replace_var for k in ltdict])
            if join_match_dict != {}:
                join_str += "".join([" LEFT JOIN %s ON %s "%(k,v) for k,v in join_match_dict.items()])
            if staticmatchdict != {}:
                static_column_str = " AND ".join([("%s %s "%(k,staticmatchops[k]) + self.replace_var) if staticmatchops[k] != "in" else ("%s %s "%(self.replace_var, "= ANY(" + k + ")")) for k in staticmatchdict])
                static_operator = " AND "
            if column_str != "":
                column_str = "(" + column_str + ")" + static_operator + static_column_str
            else:
                column_str = static_column_str

                
            value_tuple = tuple(column_match_dict.values()) + tuple(dontmatchdict.values()) + tuple(ilikedict.values())+ tuple(notlikedict.values())+ tuple(gtdict.values())+ tuple(ltdict.values()) + tuple(staticmatchdict.values())
            query_insert = "SELECT %s from %s %s where %s %s"%(items, table_name,join_str, column_str, sort_string)
            if column_str =="":
                query_insert =query_insert.replace("where","")
            if items_pp != None and offset != None:
                query_insert += " LIMIT %s OFFSET %s"%(items_pp,items_pp*(offset-1))
            print(query_insert)
            print(query_insert)
            print(query_insert)
            cur = self._execute(query_insert, value_tuple)
        if cur is None:
            return []
        else:
            res = cur.fetchall()
            return res
        
    def select_total(self, table_name, column_match_dict={}, items="*", staticmatchdict={}, staticmatchops={}, join_match_dict={}, sort_key=None, sort_order="ASC", ilikedict={}, operator="AND", gtdict={}, ltdict={}, dontmatchdict={}, notlikedict={}):
        operator = " %s "%(operator, )
        sort_string = ""
        if column_match_dict == {} and join_match_dict == {} and ilikedict == {} and dontmatchdict == {} and notlikedict == {} and staticmatchdict == {}:
            query_insert = "SELECT count(*) from %s %s"%(table_name, sort_string)
            total_records = self._execute(query_insert)
            
        else:
            static_operator = ""
            column_str = ""
            static_column_str = ""
            join_str = ""
            if column_match_dict != {}:
                column_str = " =" + self.replace_var + operator
                column_str = column_str.join(map(str, list(column_match_dict.keys()))) + " =" + self.replace_var
            if dontmatchdict != {}:
                if column_str != "":
                    column_str += operator
                column_str += column_str.join(map(str, list(dontmatchdict.keys()))) + "!=" + self.replace_var
            if ilikedict != {}:
                if column_str != "":
                    column_str += operator
                column_str += operator.join(["%s::text ilike "%(k) + self.replace_var for k in ilikedict])
            if notlikedict != {}:
                if column_str != "":
                    column_str += operator
                column_str += operator.join(["NOT %s::text ilike "%(k) + self.replace_var for k in notlikedict])
            if gtdict != {}:
                if column_str != "":
                    column_str += operator
                column_str += operator.join(["%s > "%(k) + self.replace_var for k in gtdict])
            if ltdict != {}:
                if column_str != "":
                    column_str += operator
                column_str += operator.join(["%s < "%(k) + self.replace_var for k in ltdict])
            if join_match_dict != {}:
                join_str += "".join([" LEFT JOIN %s ON %s "%(k,v) for k,v in join_match_dict.items()])
            if staticmatchdict != {}:
                static_column_str = " AND ".join([("%s %s "%(k,staticmatchops[k]) + self.replace_var) if staticmatchops[k] != "in" else ("%s %s "%(self.replace_var, "= ANY(" + k + ")")) for k in staticmatchdict])
                static_operator = " AND "
            if column_str != "":
                column_str = "(" + column_str + ")" + static_operator + static_column_str
            else:
                column_str = static_column_str
            value_tuple = tuple(column_match_dict.values()) + tuple(dontmatchdict.values()) + tuple(ilikedict.values())+ tuple(notlikedict.values())+ tuple(gtdict.values())+ tuple(ltdict.values()) + tuple(staticmatchdict.values())
            query_insert2 = "SELECT count(*) from %s %s where %s %s"%(table_name,join_str, column_str, sort_string)
            if column_str =="":
                query_insert2 =query_insert2.replace("where","")
            total_records = self._execute(query_insert2, value_tuple)
        if total_records is None:
            return []
        else:
            total_records = total_records.fetchall()
            return total_records
    
    def search(self, table_name, column_match_dict={}, column_like_dict={}, items="*", limit=None, match="and"):
        limit = " limit %s"%(limit) if limit is not None else ""

        if column_like_dict == {} and column_match_dict == {}:
            query_insert = "SELECT %s from %s %s"%(items, table_name, limit)
            cur = self._execute(query_insert)
        else:
            column_str = ""
            if column_like_dict != {}:
                column_str = " ilike " + self.replace_var + " %s "%(match,)
                column_str = column_str.join(map(str, list(column_like_dict.keys()))) + " ilike " + self.replace_var
                if column_match_dict != {}:
                    column_str += " %s "%(match,)
            if column_match_dict != {}:
                loc_column_str = "=" + self.replace_var + " %s "%(match,)
                column_str += loc_column_str.join(map(str, list(column_match_dict.keys()))) + "=" + self.replace_var
            value_tuple = tuple(list(column_like_dict.values()) + list(column_match_dict.values()))
            query_insert = "SELECT DISTINCT %s from %s where %s %s"%(items, table_name, column_str, limit)
            cur = self._execute(query_insert, value_tuple)

        retval = [] if cur is None else cur.fetchall()
        return retval   
    
    def _execute(self, sql, values=None, return_last_id=False):
        cursor = self.getCursor()
        try:
            if values is not None:
                cursor.execute(sql, values)
            else:
                cursor.execute(sql)
            if return_last_id:
                if values is not None:
                    if isinstance(return_last_id, str):
                        retval = cursor.fetchone()[return_last_id]
                    else:
                        retval = cursor.fetchone()['id']
                else:
                    retval = cursor
                self._commit()
                return retval
            self._commit()
            return cursor
        except Exception as ex:
            self._db.rollback()
            if self.logger is not None:
                self.logger.error(" ".join([str(x) for x in ["EXCEPTION in: _execute", sql, values, return_last_id, ex]]) )
            raise ex

    def _commit(self):
        self.getDatabase().commit()
