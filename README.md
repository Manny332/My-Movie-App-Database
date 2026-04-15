# My-Movie-App-Database
A curated movie dataset generator powered by the **TMDb API**, built to support a full-stack Movie App project.

This repository contains a Python script that automatically fetches and exports movie data into structured JSON files, making it easy to use as a lightweight database for web or mobile applications.

---

 Project Overview

This project generates three JSON datasets:

- **movies.json** — movie metadata
- **actors.json** — actor profiles
- **directors.json** — director profiles

It collects movies from **2000 to present**, focusing on genres such as:

- Action  
- Comedy  
- Horror  
- Drama  
- Romance  
- Thriller  
- African Cinema (movies produced in African countries)

This dataset is ideal for:
- Movie recommendation systems
- Movie search apps
- Film catalog apps
- Data analytics projects
- Personal portfolio projects

---

## 📂 Output Files

### `movies.json`
Each movie object contains:

```json
{
  "title": "Inception",
  "year": 2010,
  "genre": "Action",
  "director": "Christopher Nolan",
  "rating": 8.8,
  "language": "en",
  "country": "United States"
}
```


## `actor.json`

Each actor object contains:

```json
{
  "birthname": "Leonardo DiCaprio",
  "birthdate": "1974-11-11",
  "birthplace": "Los Angeles, California, USA",
  "country_of_origin": null
}
```
## `directors.json`

Each director object contains:

```json
{
  "birthname": "Christopher Nolan",
  "birthdate": "1970-07-30",
  "birthplace": "London, England, UK",
  "country_of_origin": null
}
```
## ⚙️ Requirements

You need the following installed:

Python 3.9+

pip

Git

Node.js

TMDb API Key

Mongodb

Python dependency

## Getting a TMDb API Key

Create an account at: 

```bash
https://www.themoviedb.org/
```
Go to your account settings

Navigate to API

Generate an API Key

## Installation & Setup

1️ Clone the repository:

```bash
git clone https://github.com/Manny332/My-Movie-App-Database.git
cd My-Movie-App-Database
```

2️ Install dependencies

(On Windows):

```bash
py -m pip install requests
```

## `Running the Script`

1️ Open tmdb_export.py

Locate the line:

```python
TMDB_API_KEY = "PUT_YOUR_KEY_HERE"
```

Replace it with your TMDb key:

```python
TMDB_API_KEY = "YOUR_REAL_KEY_HERE"
```

2️ Run the script

(On Windows):

```bash
py tmdb_export.py
```

## Output

After running successfully, the following files will be created:

movies.json

actors.json

directors.json

## ⚠️ Notes & Limitations

The script pulls movies based on popularity and vote count.
Some movies may not have complete cast or director information.
TMDb ratings are community based.
country_of_origin may be null or differe because TMDb does not always provide nationality consistently.

## `The impact of this deployment` 

This project was for a movie streaming startup that wants to build a movie recommendation and search system. They need a reliable movie database containing films, actors, directors, ratings, and genres. However, manually collecting and updating this information is slow, inconsistent, and expensive. The business needs a scalable way to generate and maintain a structured dataset that can be plugged directly into their app backend.

## `Technical Roadblocks Encountered`

When deploying the movie database system, I faced several challenges such as:

1. No ready-made dataset that fits the exact project needs (Action, Comedy, African Cinema, Horror, etc.).

2. TMDb does not provide a direct “African Cinema” genre classification, making filtering difficult.

3. TMDb API returns data in multiple endpoints, requiring additional engineering to combine:
 
- movies

- cast (actors)

- crew (directors)

Handling API rate limits to avoid being blocked during large-scale extraction.

Ensuring the output is clean and usable for backend systems (valid JSON structure, no duplicates).

Maintaining data freshness as new movies are released.

## `Engineering Solutions Implemented`

To solve these challenges, I implemented the following:

1. Built a Python automation script (tmdb_export.py) that queries the TMDb API.

2. Used TMDb’s Discover API to fetch movies by genre and release year range (2000–present).

3. Implemented logic to collect:

- 200 movies per genre

- across 7 categories (Action, Comedy, Drama, Horror, Romance, Thriller, African Cinema)

Extracted director information using the TMDb credits endpoint, filtering crew by job "Director".

Extracted actor information by selecting the top 10 cast members per movie.

Built an African Cinema filter using African ISO country codes to classify movies produced in Africa.

Added duplicate prevention using seen_movie_ids and unique dictionaries for actors/directors.

Introduced a delay (time.sleep(0.25)) to reduce rate-limit issues.

Exported final clean datasets into 3 production-ready JSON files:

- movies.json

- actors.json

- directors.json

## `Data-Driven Business Outcome`

This deployment provides a structured dataset that can instantly power movie apps, recommendation engines, and search systems.

# Measurable outcomes are:

- Generated 1,400+ movie records (200 × 7 categories).

- Generated thousands of actor records (top cast extraction).

- Generated hundreds of director records.

- Reduced manual dataset building time from weeks to minutes.

- Eliminated recurring human effort in sourcing and cleaning movie metadata.

- Enabled the business to launch faster, reducing development delays and improving time-to-market.

# Cost & efficiency benefits:

- Instead of hiring a researcher/data entry staff, the company automates dataset creation.

- Saves potentially 50–100+ hours of manual work per dataset refresh.

- Enables easy re-generation of the dataset anytime new movies are needed.

## `Troubleshooting (Deployment Steps Explained)`

# Step-by-step setup (non-technical friendly):

- Get a TMDb API Key

- Create account on TMDb

- Generate API key from settings

- Clone the repository

- Download the project code from GitHub to your computer

- Install Python dependencies

- Install requests package so Python can communicate with the TMDb API

- Insert the API key

- Add the API key into the script (tmdb_export.py)

- Run the script

- Script contacts TMDb servers and collects the movie data automatically

- Generated files appear:

  - movies.json contains movie data

  - actors.json contains actor profiles

  - directors.json contains director profiles

- Push to GitHub

- Save and upload generated JSON files to remote repo for deployment usage

- Pull into VPS/VM

- On the production server, run git pull to update the dataset

- Connet Mongodb

- Import datase into Mongdb
