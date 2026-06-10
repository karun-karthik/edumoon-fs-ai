from fastapi import FastAPI

app = FastAPI() # creates an application instance

users = [{"id": 1, "name": "John"}, {"id": 2, "name": "Doe"}]

@app.get("/")   # route-decorator: if someone hits / then execute this function
def read_root():
    return {"Hello": "World"}

@app.get("/user")
def read_root():
    return {"user_name": "Edumoon"}

@app.post("/user")
def read_user(user: dict):
    user["greeting"] = "Welcome"
    return user

@app.get("/user/{user_id}")
def read_user_by_id(user_id: int):
    return {
        "user_id": user_id
    }

@app.get("/users")
def read_user_by_id(
    page:int=1,
    size:int=10
):
    return {
        "size": size,
        "page": page
    }