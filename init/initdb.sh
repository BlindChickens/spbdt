#!/bin/bash
ARG1=${1:-5432}
echo $ARG1
p=$ARG1
dbname="spbdt"
host="127.0.0.1"
printf '### dropdb ###\n'
dropdb -h $host -p $p -U postgres $dbname
printf '### dropdb ###\n'
printf '### createdb ###\n'
createdb -h $host -p $p -U postgres $dbname
printf '### createdb ###\n'
printf '### mainsql ###\n'
cat spbdt.main.sql | psql -p $p -h $host -U postgres $dbname
printf '### mainsql ###\n'
exit
