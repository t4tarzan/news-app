#!/bin/bash

# Create python directory if it doesn't exist
mkdir -p python

# Clone SadTalker repository
git clone https://github.com/OpenTalker/SadTalker.git python/sadtalker_repo

# Create virtual environment
python3 -m venv python/venv

# Activate virtual environment
source python/venv/bin/activate

# Install dependencies
cd python/sadtalker_repo
pip install -r requirements.txt
pip install gfpgan
pip install tts

# Download pre-trained models
wget -nc https://github.com/OpenTalker/SadTalker/releases/download/v0.0.2/checkpoints.zip
unzip -n checkpoints.zip -d checkpoints/

# Create symbolic link to inference script
ln -s python/sadtalker_repo/inference.py python/inference.py

echo "SadTalker setup complete!"
