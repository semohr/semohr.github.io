# ------------------------------------------------------------------------------ #
# Creates the blog.html with the entries in the corresponding folder sorted by
# date.
#
# @Author: Sebastian B. Mohr
# @Date:   2021-06-05 15:54:03
# @Last Modified by:   Sebastian Mohr
# @Last Modified time: 2021-07-20 14:40:38
# ------------------------------------------------------------------------------ #

# Imports
import os
from glob import glob
from datetime import datetime
import operator
from bs4 import BeautifulSoup

from convert import main
import nbconvert

# Get all ipynb and markdown files from entries folder
onlyfiles = glob(os.path.join("../entries", "*.ipynb"))
onlyfiles += glob(os.path.join("../entries", "*.md"))


# Check if the files follow the nameing schema
entries = []
for file in onlyfiles:
    # Check if file start with date, if not do not use them!
    try:
        base_name = os.path.basename(file)
        date, title = base_name.split("_")
        title, ending = title.split(".")
    except:
        print(f"File nameing schema does not match {file}")
        continue
    # Create entry for file
    entry = {}
    entry["date"] = datetime.strptime(date, "%Y-%m-%d")
    entry["fpath"] = file
    entry["name"] = base_name
    entry["title_short"] = title
    entries.append(entry)

# sort list on date
entries.sort(key=operator.itemgetter("date"))


"""# Create html file

We start with the header and other static page elements and 
add the generated navigation bar for all entries.
"""
# Open the static html file we want to edit in the following
soup = BeautifulSoup(open("./static_blog.html", "r"), "html.parser")


def create_nav_item(title_short, subheaders):
    """
    Creates html tag for a blog entry, with
    clickable link and icon.
    <li><a href="#about"><i class="fa fa-user"></i><span>About</span></a></li>
    <li class="sub-navigator"><a href="#publications"></i></i>Publications</a></li>
    TODO
    ----
    """
    lis = []
    # Main tag
    li = soup.new_tag("li")
    a = soup.new_tag("a")
    a["href"] = "#" + title_short.replace(" ", "-")
    span = soup.new_tag("span")
    span.string = title_short
    a.insert(0, span)
    li.insert(0, a)
    lis.append(li)

    # Sub tags
    for header in subheaders:
        li = soup.new_tag("li")
        li["class"] = "sub-navigator"
        a = soup.new_tag("a")
        a["href"] = "#" + header.text.replace(" ", "-")
        span = soup.new_tag("span")
        span.string = header.text
        a.insert(0, span)
        li.insert(0, a)
        lis.append(li)

    return lis


def create_content(
    name,
):
    os.system(f"jupyter nbconvert --to html '../entries/{name}' --template full")
    # Insert in section
    name, ending = name.split(".")
    content = BeautifulSoup(open("../entries/" + name + ".html", "r"), "html.parser")
    content = content.find(id="notebook-container")

    # remove anchor links
    for e in content.find_all("a", {"class": "anchor-link"}):
        e.extract()
    return content


# We add the content for each blog entry and add the navigator
nav = soup.find(id="blog_nav")
ul = soup.new_tag("ul")
for entry in entries:
    # content
    content = create_content(entry["name"])
    section = soup.find(id="main")
    section.insert(0, content)

    # insert
    subheaders = soup.find_all("h2")
    for item in create_nav_item(entry["title_short"], subheaders):
        ul.append(item)
nav.insert(1, ul)


# Some markup
# - remove prompt
for e in soup.find_all("div", {"class": "prompt"}):
    e.extract()
# - add code elements to pre
for e in soup.find_all("pre"):
    p = soup.new_tag("pre")
    c = soup.new_tag("code")
    c["class"] = "language-python"
    c.string = e.text
    p.insert(0, c)
    e.insert_before(p)
    e.extract()

"""# Save file
"""
with open("../../blog.html", "w") as f:
    f.write(soup.prettify())
