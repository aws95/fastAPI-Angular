from fastapi import FastAPI, HTTPException

from model import Article

from db import (
    fetch_article,
    fetch_all_articles,
    create_article,
    vote,
    populate_db
)

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:4200",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"msg": "ok"}


@app.get("/api/v1/article/populate")
async def populate():
    response = await populate_db()
    if response:
        return response
    raise HTTPException(400, "couldn't populate database")


@app.get("/api/v1/article")
async def get_articles(order: str = "up_votes",
                       type: str = "1",
                       search: str = ""):
    response = await fetch_all_articles(order,
                                        type,
                                        search)
    return response


@app.get("/api/v1/article/{id}", response_model=Article)
async def get_article(id):
    response = await fetch_article(id)
    if response:
        return response
    raise HTTPException(404, f"There is no article with the id {id}")


@app.post("/api/v1/article", response_model=Article)
async def post_article(article: Article):
    response = await create_article(article.dict())
    if response:
        return response
    raise HTTPException(400, "Something went wrong")


@app.put("/api/v1/article/{id}", response_model=Article)
async def vote_article(id: str, attr: str):
    print(id,attr)
    response = await vote(id, attr)
    if response:
        return response
    raise HTTPException(404, f"There is no article with the id {id}")
