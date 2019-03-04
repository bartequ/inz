const GRAPH_FILE = "Land_Mobile_Radio_system_structure.tndb";
const GRAPH_STYLE = "cy-style.json";

function findObjectByKey(array, key, value) {
  for (let i = 0; i < array.length; i++) {
    if (array[i][key] === value) {
      return array[i];
    }
  }
    return null;
}

function xmlToJson(xml) {
  let obj = {};

  if (xml.nodeType === 1) {
    if (xml.attributes.length > 0) {
      for (let j = 0; j < xml.attributes.length; j++) {
        let attribute = xml.attributes.item(j);
        obj[attribute.nodeName] = attribute.nodeValue;
      }
    }
  } else if (xml.nodeType === 3) {
    obj = xml.nodeValue.trim(); 
  }

  if (xml.hasChildNodes()) {
    for (let i = 0; i < xml.childNodes.length; i++) {
      let item = xml.childNodes.item(i);
      let nodeName = item.nodeName;
      if (typeof(obj[nodeName]) === "undefined") {
        let tmp = xmlToJson(item);
        if (tmp !== "") 
          obj[nodeName] = tmp;
      } else {
        if (typeof(obj[nodeName].push) === "undefined") {
          let old = obj[nodeName];
          obj[nodeName] = [];
          obj[nodeName].push(old);
        }
        let tmp = xmlToJson(item);
        if (tmp !== "") 
          obj[nodeName].push(tmp);
      }
    }
  }
  if (!Array.isArray(obj) && typeof obj === 'object') {
    let keys = Object.keys(obj);
    if (keys.length === 1 && keys[0] === '#text') return obj['#text'];
    if (keys.length === 0) return null;
  }
  return obj;
}

function loadJsonData(rs) {

  let zonesNumberNames = [];
  let cluster = [];
  let loadStructure = [];
  let mso = [];
  let zone = [];
  let site = [];
  let clusterLength;

    if (!Array.isArray(rs.cluster))  {
      loadStructure.push({group: "nodes", data: {id: rs.cluster.id, name: rs.cluster.name, number: rs.cluster.number, radiosystemid: rs.cluster.radiosystemid,
                          label: rs.cluster.name}, classes: 'cluster'});
      clusterLength = 1;
      cluster[0] = rs.cluster;
    }
    else {
      clusterLength = rs.cluster.length;
      for (let a=0; a<clusterLength; a++) {
        cluster.push(rs.cluster[a]);
      }
    }
    for (let i=0; i<clusterLength; i++){
      if (clusterLength > 1){
        loadStructure.push({group: "nodes", data: {id: cluster[i].id, name: rs.cluster[i].name, number: rs.cluster[i].number, radiosystemid: rs.cluster[i].radiosystemid,
                            label: rs.cluster[i].name}, classes: 'cluster'});
      }
        let msoLength;
        if (!Array.isArray(cluster[i].mso)){
          loadStructure.push({group: "nodes", data: {id: cluster[i].mso.id, parent: cluster[i].id, cenpresent: cluster[i].mso.cenpresent, name: cluster[i].mso.name, 
                              number: cluster[i].mso.number, label: cluster[i].mso.name}, classes: 'mso'});
          msoLength = 1;
        }
        else {
          msoLength = cluster[i].mso.length; 
          for (let a=0; a<msoLength; a++){
            mso.push(cluster[i].mso[a]);
          }
        }  
        for (let j=0; j<msoLength; j++){
          if (msoLength > 1){
            loadStructure.push({group: "nodes", data: {id: mso[j].id, parent: cluster[i].id, cenpresent: mso[j].cenpresent, name: mso[j].name, 
                                number: mso[j].number, label: mso[j].name}, classes: 'mso'});
            mso.push(cluster[i].mso[j]);
          }
        }
        mso = [];

          let zoneLength;
          if (!Array.isArray(cluster[i].zone)){
            loadStructure.push({group: "nodes", data: {id: cluster[i].zone.id, parent: cluster[i].zone.msoid, clusterid: cluster[i].zone.clusterid, name: cluster[i].zone.name, 
                                number:cluster[i].zone.number, siteLink: cluster[i].zone.siteLink, label: cluster[i].zone.name}, classes: 'zone'});
            zonesNumberNames.push({id: cluster[i].zone.id, number: cluster[i].zone.number});
            zoneLength = 1;
            zone.push(cluster[i].zone);
          }
          else {
            zoneLength = cluster[i].zone.length; 
            for (let a=0; a<zoneLength; a++){
              zone.push(cluster[i].zone[a]);
            }
          }
          for (let k=0; k<zoneLength; k++){
            if (zoneLength > 1) {
              loadStructure.push({group: "nodes", data: {id: zone[k].id, parent: zone[k].msoid, clusterid: zone[k].clusterid, name: zone[k].name, 
                                  number: zone[k].number, siteLink: zone[k].siteLink, label: zone[k].name}, classes:'zone'});
              zonesNumberNames.push({id: zone[k].id, number: zone[k].number});
              zone.push(cluster[i].zone[k]);
            }
    
            let siteLength;
            if (!Array.isArray(zone[k].site)){
              loadStructure.push({group: "nodes", data: {id: zone[k].site.id, parent: zone[k].site.zoneid, name: zone[k].site.name, number: zone[k].site.number, 
                                  siteLink: zone[k].site.siteLink}, classes: "site" });
              siteLength = 1;
            }
            else {  
              siteLength = zone[k].site.length;   
              for (let a=0; a<siteLength; a++){
                site.push(zone[k].site[a]); 
              }
            }
            for (let m=0; m<siteLength; m++){
              if (siteLength > 1) {
                loadStructure.push({group: "nodes", data: {id: site[m].id, parent: site[m].zoneid, name: site[m].name, number: site[m].number, 
                                    siteLink: site[m].siteLink}, classes:'site' });
                  site.push(zone[k].site[m]);
              }
            }
            site = [];
          }
          zone = [];
    }

    return new Promise(function(resolve, reject) {
      resolve([rs, loadStructure, zonesNumberNames, cluster]);
    });
}

function loadJsonInterZoneLinks(rs, loadStructure, zonesNumberNames, cluster){
      
  if (Array.isArray(rs.interzonelinkbundle)) {
    for (i=0; i<rs.interzonelinkbundle.length; i++) {
      let zoneA = rs.interzonelinkbundle[i].zonea;
      let zoneB = rs.interzonelinkbundle[i].zoneb;
      loadStructure.push({group: "edges", data: { id: rs.interzonelinkbundle[i].id, source: findObjectByKey(zonesNumberNames, 'number', zoneA).id, 
                          target: findObjectByKey(zonesNumberNames, 'number', zoneB).id }, classes: 'interZoneLink'});
    }
  }
  return new Promise(function(resolve, reject) {
    resolve([loadStructure, zonesNumberNames, cluster]);
  });
}

function loadJsonIntraZoneLinks(loadStructure, zonesNumberNames, cluster) {

  let mso = [];
    for (let i=0; i<cluster.length; i++){
      let msoLength;
      if (!Array.isArray(cluster[i].mso)){
        msoLength = 1;
        mso.push(cluster[i].mso);
      }
      else {
        msoLength = cluster[i].mso.length;
        for (let a=0; a<cluster[i].mso.length; a++){
          mso.push(cluster[i].mso[a]);
        }
      }  
            
      for (let j=0; j<msoLength; j++){
        if ('intraZoneLink' in mso[j] === true) {  
          if (!Array.isArray(mso[j].intraZoneLink)) {
            let zoneA = mso[j].intraZoneLink.zoneAId;
            let zoneB = mso[j].intraZoneLink.zoneBId;
            loadStructure.push({group: "edges", data: { id: mso[j].intraZoneLink.id, source: findObjectByKey(zonesNumberNames, 'number', zoneA).id, 
                                target: findObjectByKey(zonesNumberNames, 'number', zoneB).id }, classes: 'intraZoneLink'});
          }
          else {
            for (let k=0; k<mso[j].intraZoneLink.length; k++) {
              let zoneA = mso[j].intraZoneLink[k].zoneAId;
              let zoneB = mso[j].intraZoneLink[k].zoneBId;
              loadStructure.push({group: "edges", data: { id: mso[j].intraZoneLink[k].id, source: findObjectByKey(zonesNumberNames, 'number', zoneA).id, 
                                  target: findObjectByKey(zonesNumberNames, 'number', zoneB).id }, classes: 'intraZoneLink'});
            }
          }
        }
      }
      mso = [];
    }
  return loadStructure;
}

function divideStructureIntoNodesAndEdges(data) {
    let nodes = [];
    let edges = [];
    for (let i=0; i<data.length; i++) {
        if (data[i].group === 'nodes') {
            nodes.push(data[i]);
        }
        else if (data[i].group === 'edges') {
            edges.push(data[i]);
        }
    }
    return {nodes, edges};
}

function assignPosition(elements, cy) {
    let nodesPosition = cy.nodes().map(node => node.position());

    if (nodesPosition.length === elements.nodes.length) {
        for (let i=0; i<nodesPosition.length; i++) {
            elements.nodes[i].position = {
                x: nodesPosition[i].x,
                y: nodesPosition[i].y
            };
            elements.nodes[i].data.orgPos = {
                x: nodesPosition[i].x,
                y: nodesPosition[i].y
            };
        }
    }
}

function loadStructure() {

        return fetch(GRAPH_FILE)
            .then(response => response.text())
            .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
            .then(function (dataXml) {
                return xmlToJson(dataXml);
            })
            .then(function (dataJson) {
                return loadJsonData(dataJson.DLRadioSystem);
            })
            .then(function (dataNodes) {
                return loadJsonInterZoneLinks(dataNodes[0], dataNodes[1], dataNodes[2], dataNodes[3])
            })
            .then(function (dataNodesEdges) {
                return loadJsonIntraZoneLinks(dataNodesEdges[0], dataNodesEdges[1], dataNodesEdges[2]);
            });
}

function loadGraphStyle() {

        return fetch(GRAPH_STYLE, {mode: 'no-cors'})
            .then(function (res) {
                return res.json()
            });
}

function drawNetwork(dataArray) {

    const data = dataArray[0];
    const style = dataArray[1];
    let elements = divideStructureIntoNodesAndEdges(data);

    const cy = window.cy = cytoscape({
        container: document.getElementById('cy'),

        style: style,

        elements: elements,

        ready: function(){
            window.cy = this;
        }
    });
    const layout = cy.layout({name: 'cose-bilkent'});
    layout.run();

    assignPosition(elements, cy);

    cy.on('select unselect', 'node', function(){
        let node = cy.$('node:selected');

        if(node.nonempty()){
            Promise.resolve().then(function(){
                return highlight(node);
            });
        }
        else {
            clear();
        }
    });

    cy.$('.site').qtip({
        content: function(){
            for (let i=0; i<data.length; i++){
                if (this.id() === data[i].data.id)
                    return 'site number: ' + data[i].data.number + '<br>siteLink: ' + data[i].data.siteLink;
            }
        },
        position: {
            target: 'mouse',
            my: 'top right',
            adjust: {
                mouse: false
            }
        },
        style: {
            classes: 'qtip-bootstrap',
        },
        show: {
            event: 'cxttapend'
        }
    });

    cy.$('.zone').qtip({
        content: function(){
            for (let i=0; i<data.length; i++){
                if (this.id() === data[i].data.id){
                    let description = "siteLinks:<br>";
                    if (Array.isArray(data[i].data.siteLink)) {
                        for (let j=0; j<data[i].data.siteLink.length; j++) {
                            description += "id: " + data[i].data.siteLink[j].id + "<br>" + "number: " + data[i].data.siteLink[j].number + "<br><br>";
                        }
                        return description;
                    }
                }
            }
        },
        position: {
            my: 'left center',
            target: 'mouse',
            adjust: {
                mouse: false
            }
        },
        style: {
            classes: 'qtip-bootstrap',
        },
        show: {
            event: 'cxttapend'
        }
    });

    function highlight(node){

        let nhood = cy.nodes('node[parent="'+node.id()+'"]');
        let others = cy.elements().not(nhood);

        cy.edges().style("visibility", "hidden");

        let layoutZoom = nhood.layout({
            name: 'grid',
            elements: nhood
        });
        layout.stop();
        layoutZoom.run();

        nhood.style("visibility", "visible");
        let othersBool = [];
        for (let i=0; i<others.length; i++) {
            othersBool[i] = false;
        }

        let ancestors = nhood[0].ancestors();
        for (let j=0; j<ancestors.length; j++) {
            for (let i=0; i<others.length; i++) {
                if (ancestors[j].data().id === others[i].data().id) {
                    others[i].style("visibility", "visible");
                    othersBool[i] = true;
                    continue;
                }
                else if (!othersBool[i]) {
                    others[i].style("visibility", "hidden");
                }
            }
        }
    }

    function clear(){
        cy.elements().style("visibility", "visible");
        layout.run();
    }
}

Promise.all([
        loadStructure(),
        loadGraphStyle()
])
.catch(function(error) {
    console.log("Loading files into application failed, " + error);
})
.then(function(dataArray) {
    return drawNetwork(dataArray)
});