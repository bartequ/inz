Land_Mobile_Radio_system_structure.tndb file contains description of network structure in XML . To run appllication download files, start server e.g. Apache and type into browser localhost:port/YOUR_CATALOG. Default port is 8080.
File converter.js contains all of the app funcionality, cy-style.json and style.css contain information about styles.

&lt;div id="cy"&gt;&lt;/div&gt; is holder for cytoscape object.

Input file is fetched from local folder.

File is divided into 3 main functions which call other function to realize subtasks.

- loadStructure() is responsible for fetch data and prepare to draw by transformating to different form
- loadGraphStyle() is responsible for fetch graph style (which is different than main application style file)
- drawNetwork() is responsible for show network topology in proper form (uses cytoscape.js library)
