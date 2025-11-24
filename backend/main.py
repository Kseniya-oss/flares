from fastapi import FastAPI, Response # основной класс для создания приложения
from fastapi.staticfiles import StaticFiles # для раздачи статических файлов (фронт)
from fastapi.responses import FileResponse # для отправки HTML файла
from pydantic import BaseModel # для создания моделей с валидацией данных
# from typing import Optional, Literal  для типизации параметров
import random # для геренации случайных данных в моках
import uvicorn


# Текущее состояние системы
current_state = {
    "running": False,
    "path": None, # путь к видео-файлу
    "fps": 30.0 # текущий FPS - не понимаю пока зачем
}

# параметры обработки видео
processing_params = {
    "f_min": 0.5, # минимальная частота морганий (Гц)
    "f_max": 12.0, # максимальная частота морганий (Гц)
    "window_sec": 5.0, # временное окно анализа (сек)
    "snr_thresh": 6.0 # сигнал должен быть в 6 раз сильнее шума
}

# счетчик кадров для моковых данных
frame_counter = 0

# валидация данных
class StartRequest(BaseModel):
    path: str

class ParamsRequest(BaseModel):
    f_min: float
    f_max: float
    window_sec: float
    snr_thresh: float

# данные, которые показывает фронт
class BBoxObject(BaseModel): # обнаруженный объект - моргающий
    id: int # уникальный id объекта - номер объекта в кадре
    bbox: list[int] # [x, y, width, height] прямоугольная область объекта, где рисовать рамку для фронта
    freq_hz: float # частота морганий объекта
    prob: float # вероятность, что это ряльно моргание

class BliinksResponse(BaseModel): # ответ на запрос данных
    frame_id: int # номер кадра
    object: list[BBoxObject] # список всех обнаруженных объектов в кадре

app = FastAPI(title="Blink Detection", version="1.0") # создание экзмепляра приложения FastAPI

# покдлючаем статику в нашему апи
app.mount("/css", StaticFiles(directory="../frontend/css", html=True), name="css") # /css/style.css
app.mount("/js", StaticFiles(directory="../frontend/js", html=True), name="js") # /js/script.js

@app.get("/") # обычный вход, get - получить
@app.get("/app") # альтернативный вход
async def serve_frontend(response: Response):

    # тип против кеша
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"

    return FileResponse("../frontend/index.html") # отдает html

@app.get("/api/status")
async def get_status(): # возвращает текущее состояние системы
    return {
        "running": current_state["running"],
        "source": "video" if current_state["running"] else "mock",
        "fps": current_state["fps"]
    }

@app.post("/api/start") # post - отправка данных на сервер
async def start_processing(request: StartRequest):
    # Обновляется состояние
    current_state["running"] = True
    current_state["path"] = request.path

    return {"ok": True}

@app.post("/api/stop")
async def stop_processing():
    current_state['running'] = False
    return {"ok": True}

@app.post("/api/params")
async def set_parameters(request: ParamsRequest):
    # Обновление параметров обработки
    processing_params.update({
        "f_min": request.f_min,
        "f_max": request.f_max,
        "window_sec": request.window_sec,
        "snr_thresh": request.snr_thresh
    })
    return {'ok': True}

@app.get('/api/blinks')
async def get_blinks():
    global frame_counter

    frame_counter += 1

    # случайное кол-во объектов (0-3)
    num_object = random.randint(0, 3)
    object = []

    # слуйчное расположение квадратиков (объектов)
    for i in range(num_object):
        bbox = [
            random.randint(0, 640), # x
            random.randint(0, 480), # y
            random.randint(20, 100), # weight
            random.randint(20, 140), # height
            ]

        # случайная частота и вероятность
        freq = round(random.uniform(processing_params["f_min"], processing_params["f_max"]), 1)
        prob = round(random.uniform(0.5, 0.99), 2)

        object.append({
            "id": i + 1,
            "bbox": bbox,
            "freq_hz": freq,
            "prob": prob
        })

    return {
        "frame_id": frame_counter,
        "object": object
    }

# точка входа для запуска сервера
if __name__ == "__main__":
    uvicorn.run(app, host="0 0 0 0", port=8000)
