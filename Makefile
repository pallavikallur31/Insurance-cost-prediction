PYTHON = C:\ProgramData\Anaconda3\python.exe

install:
	$(PYTHON) -m pip install flask flask-cors pandas scikit-learn

train:
	$(PYTHON) train_model.py

run:
	$(PYTHON) app.py

all: install train run

clean:
	del /f model.pkl

.PHONY: install train run all clean
