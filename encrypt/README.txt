
openssl genrsa 2048 > private.key
chmod 400 private.key
openssl req -new -x509 -nodes -sha256 -days 365 -key private.key -out primary.crt
