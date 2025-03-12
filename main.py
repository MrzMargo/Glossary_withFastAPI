from fastapi import FastAPI, HTTPException, Request
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List

app = FastAPI()
templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="static"), name="static")

class Term(BaseModel):
    id: int
    word: str
    definition: str

glossary: List[Term] = []

@app.post("/terms/", response_model=Term)
async def create_term(term: Term):
    glossary.append(term)
    return term

@app.get("/terms/{term_id}", response_model=Term)
async def read_term(term_id: int):
    for term in glossary:
        if term.id == term_id:
            return term
    raise HTTPException(status_code=404, detail="Term not found")

@app.get("/terms/", response_model=List[Term])
async def read_terms():
    return glossary

@app.delete("/terms/{term_id}", response_model=Term)
async def delete_term(term_id: int):
    for term in glossary:
        if term.id == term_id:
            glossary.remove(term)
            return term
    raise HTTPException(status_code=404, detail="Term not found")

@app.put("/terms/{term_id}", response_model=Term)
async def update_term(term_id: int, updated_term: Term):
    for index, term in enumerate(glossary):
        if term.id == term_id:
            glossary[index] = updated_term
            return updated_term
    raise HTTPException(status_code=404, detail="Term not found")

@app.get("/", response_class=HTMLResponse)
async def read_glossary(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})