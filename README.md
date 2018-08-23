Name of the 'MZ_Centracom.tndb' was changed to 'test1.tndb', 'MZ_AGG_SW_Test.tndb' to 'test.tndb' to simplify testing. File cytoscape.min.js, cytoscape-qtip.js are files from Cytoscape.js library. To run appllication download files, start server e.g. Apache and type into browser localhost:port/YOUR_CATALOG. Default port is 8080.
File converter.js contains all of the app funcionality, cy-style.json and style.css contain information about styles.

&lt;div id="cy"&gt;&lt;/div&gt; is holder for cytoscape object.

Files test.tndb (or test1.tnsb) is fetched from local folder.

1) First step is loading test.tndb. After file is loaded function loadJsonData() creates:
 - Array loadStructure which contains informations about nodes, loadJsonInterZoneLinks() and loadJsonIntraZoneLinks() push edges and cytoscape attribute 'elements' load data from that Array,
 - Array zonesNumberNames used by loadJsonInterZoneLinks() and loadJsonIntraZoneLinks(),
 - cluster - Array contains clusters used by  loadJsonIntraZoneLinks()
 
 2) Function loadJsonInterZoneLinks() is adding edges to loadStructure and forward cluster to loadJsonIntraZoneLinks(). loadJsonInterZoneLinks() is invoked second because it needs 'rs' parameter which loadJsonData() returns.
 
 3) Function loadJsonIntraZoneLinks() is adding edges to loadStructure
