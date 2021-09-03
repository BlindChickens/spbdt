# Source files for SmousProBetaDeluxeTycoon


## Requirements:
```
sudo apt-get update
```
```
npm - (sudo apt install npm)
```
```
grunt-cli (npm install -g grunt-cli)
```
```
python3.5 - (sudo apt-get install python3.5)
```
```
python3-flask - (sudo apt-get install python3-flask)
```
```
python3-psycopg2 - (sudo apt-get install python3-psycopg)
```
```
postgres9.5 - (sudo apt-get install python3.5)
```
```
pgAdmin3 - (sudo apt-get install pgadmin3)
```

Open pgAdmin3 and make a new connection with the following details:
```
Name: spbdt
Host: 127.0.0.1
Port: 5432
Password: masterkey
```
If everything is installed cd to spbdt/src

run: ```npm install```

And then run: ```grunt```

If grunt finished successfully open a second terminal:

cd to spbdt/spbdt_build
run: ```python3 main.py```


## Solutions to errors:

1.  When you get ```/usr/bin/env: ‘node’: No such file or directory```:

    run: ```sudo ln -s "$(which nodejs)" /usr/bin/node```


2.  When trying to make a connection in pgAdmin3 and password authentication failed:

    run: ```sudo -u postgres psql```

    then type: ```\password```

    then ```masterkey```

    and again ```masterkey```
