# ------------------------------------------------------------------------------ #
# This scripts converts a ipython notebook or markdown file into an html string
# which can be used as blog entry.
#
# @Author:        Sebastian B. Mohr
# @Email:
# @Created:       2021-06-02 15:40:57
# @Last Modified: 2021-06-02 18:49:36
# ------------------------------------------------------------------------------ #
import argparse
import os
import codecs
import json
import markdown
import html as html_lib
from bs4 import BeautifulSoup
import re

# REGEX is hell... this removes all ansi characters
ansi_escape = re.compile(r"\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])")


def cell_data_to_html(output):
    """
    Converts output dict to html string
    for further processing.

    There are three different output types execute_result,
    display_data and stream see https://nbformat.readthedocs.io/en/latest/format_description.html#cell-types.

    """

    if output["output_type"] == "stream":
        html = "<pre>\n" + ansi_escape.sub("", "".join(output["text"])) + "</pre>\n"

    elif (
        output["output_type"] == "execute_result"
        or output["output_type"] == "display_data"
    ):
        # These types are have the same structure and normaly house pictures or text
        if "text/plain" in output["data"]:
            html = (
                "<pre>\n"
                + ansi_escape.sub("", "".join(output["data"]["text/plain"]))
                + "</pre>\n"
            )
        if "image/png" in output["data"]:
            html += (
                f"<img src='data:image/png;base64,{output['data']['image/png']}'></img>"
            )
    return html


def convert_ipynb(file):
    # Load file
    f = codecs.open(file, "r")
    source = f.read()
    data = json.loads(source)

    html_body = ""

    # Iterate every cell
    for cell in data["cells"]:
        # Convert depending on type
        if cell["cell_type"] == "markdown":
            # Convert markdown to html and add to html text
            for snippet in cell["source"]:
                html_body += markdown.markdown(snippet)

        elif cell["cell_type"] == "code":
            # Convert code cells to html using own wrapper
            html_body += "<pre><code class='hljs language-python'>\n"
            html_body += "".join(cell["source"])
            html_body += "</code></pre>\n"

            # Look for cell outputs only code cells have output
            if len(cell["outputs"]) > 0:
                for output in cell["outputs"]:
                    html_body += "<div class='output'>"
                    html_body += cell_data_to_html(output)
                    html_body += "</div>"

    return html_body


def convert_markdow(file):
    # Load file
    f = open(file, "r")

    # Return html
    return markdown.markdown(f.read(), extensions=["fenced_code"])


def main(fpath):
    filename, file_extension = os.path.splitext(fpath)

    # Create html string
    html = "<div class=blog-entry>"

    # ipynb or markdown
    if file_extension == ".ipynb":
        html += convert_ipynb(fpath)
    elif file_extension == ".md":
        html += convert_markdow(fpath)

    html += "</div>"

    # Pretty print to file
    res = BeautifulSoup(html, "html.parser").prettify()

    return res


if __name__ == "__main__":

    # Input file
    parser = argparse.ArgumentParser(
        description="Converts a ipython notebook file into an html page which can be used as blog entry."
    )
    parser.add_argument(
        "file",
        metavar="File",
        type=str,
        help="Input file, for conversion can be .md or .ipynb.",
    )
    parser.add_argument("save", type=bool, help="Save to file?", default=False)
    args = parser.parse_args()

    filename, file_extension = os.path.splitext(args.file)

    # Create html string
    html = "<div class=blog-entry>"

    # ipynb or markdown
    if file_extension == ".ipynb":
        html += convert_ipynb(args.file)
    elif file_extension == ".md":
        html += convert_markdow(args.file)

    html += "</div>"

    # Pretty print to file
    res = BeautifulSoup(html, "html.parser").prettify()

    # Write to file

    if args.save:
        f = open(f"{filename}.html", "w")
        f.write(res)
        f.close()
    else:
        import sys

        sys.stdout.write(res)
        sys.stdout.flush()
        sys.exit(0)
