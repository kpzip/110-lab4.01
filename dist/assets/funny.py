import uuid

for i in range(6969):
    with open("a" + str(uuid.uuid4()), "wb") as f:
        f.write(bytes("hi\n" * 1024, encoding='utf8'))
