# ------------------------------------------------------------------------------ #
# Creates the blog.html with the entries in the corresponding folder sorted by
# date.
#
# @Author: Sebastian B. Mohr
# @Date:   2021-06-05 15:54:03
# @Last Modified by:   Sebastian B. Mohr
# @Last Modified time: 2021-06-07 17:41:23
# ------------------------------------------------------------------------------ #

# Imports
from os import listdir
from os.path import isfile, join
from datetime import datetime
import operator
from bs4 import BeautifulSoup

from convert import main

# Check folder for filenames
path = "../entries"
onlyfiles = [f for f in listdir(path) if isfile(join(path, f))]


entries = []
for file in onlyfiles:
    # Check if file start with date, if not do not use them!
    try:
        date, name = file.split("_")
    except:
        continue
    # Create entry for file
    entry = {}
    entry["date"] = datetime.strptime(date, "%Y-%m-%d")
    entry["filename"] = file
    entry["path"] = path
    entry["title_short"] = "Test"
    entries.append(entry)

# sort list on date
entries.sort(key=operator.itemgetter("date"))


"""# Create html file

We start with the header and other static page elements and 
add the generated navigation bar for all entries.
"""
# Open the static html file we want to edit in the following
soup = BeautifulSoup(open("./static_blog.html", "r"), "html.parser")


def create_nav_item(
    title_short,
):
    """
    Creates html tag for an blog entry, with
    clickable link and icon.

    TODO
    ----
    """
    return title_short


# Insert all navigator list tags into the source file
nav = soup.find(id="blog_nav")
ul = soup.new_tag("ul")
for entry in entries:
    tag = soup.new_tag("li")
    tag.string = create_nav_item(entry["title_short"])
    ul.insert(0, tag)
nav.insert(1, ul)


# We add the content for each blog entry
for entry in entries:
    entry["html"] = main(entry["path"] + "/" + entry["filename"])

    # Create section


"""# Save file
"""
with open("../../blog.html", "w") as f:
    f.write(soup.prettify())
