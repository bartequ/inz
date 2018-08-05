function findObjectByKey(array, key, value) {
  for (var i = 0; i < array.length; i++) {
      if (array[i][key] === value) {
          return array[i];
      }
  }
  return null;
}

function load(array) {
  for (i=0; i<array.length; i++)
    cy.add(array[i]);
}


fetch('test1.json', {mode: 'no-cors'})
.then(function(res) {
  return res.json()
})
.then(function(data) {

var radioSystem = data;  
var rs = radioSystem.DLRadioSystem;
var loadClusters = [];
var loadMSOs = [];
var loadZones = [];
var loadSites = [];
var zonesNumberNames = [];
var interZoneLinks = [];
var intraZoneLinks = [];
var cluster = [];
    
function loadJsonData() {

  var mso = [];
  var zone = [];
  var site = [];
  var clusterLength;

    if (!Array.isArray(rs.cluster))  {
      loadClusters.push({group: "nodes", data: { id: rs.cluster.id} });
      clusterLength = 1;
      cluster[0] = rs.cluster;
    }
    else {
      clusterLength = rs.cluster.length;
      for (var a=0; a<clusterLength; a++)
        cluster.push(rs.cluster[a]);
    }
    for (var i=0; i<clusterLength; i++){
      if (clusterLength > 1)
        loadClusters.push({group: "nodes", data: { id: cluster[i].id} });
      
          var msoLength;
          if (!Array.isArray(cluster[i].mso)){
            loadMSOs.push({group: "nodes", data: { id: cluster[i].mso.id, parent: cluster[i].id} });
            msoLength = 1;
          }
          else {
            msoLength = cluster[i].mso.length; 
            for (var a=0; a<msoLength; a++)
              mso.push(cluster[i].mso[a]);
          }  
          for (var j=0; j<msoLength; j++){
            if (msoLength > 1){
              loadMSOs.push({group: "nodes", data: { id: mso[j].id, parent: cluster[i].id} });
              mso.push(cluster[i].mso[j]);
          }
        }
        mso = [];

          var zoneLength;
            if (!Array.isArray(cluster[i].zone)){
              loadZones.push({group: "nodes", data: { id: cluster[i].zone.id, parent: cluster[i].zone.msoid, name: cluster[i].zone.name, label: cluster[i].zone.name} });
              zonesNumberNames.push({id: cluster[i].zone.id, number: cluster[i].zone.number});
              zoneLength = 1;
              zone.push(cluster[i].zone);
            }
            else {
              zoneLength = cluster[i].zone.length; 
              for (var a=0; a<zoneLength; a++)
                zone.push(cluster[i].zone[a]);
            }
            for (var k=0; k<zoneLength; k++){
              if (zoneLength > 1) {
                loadZones.push({group: "nodes", data: { id: zone[k].id, parent: zone[k].msoid, name: zone[k].name, label: zone[k].name} });
                zonesNumberNames.push({id: zone[k].id, number: zone[k].number});
                zone.push(cluster[i].zone[k]);
              }
    
              var siteLength;
              var xWidth = screen.width/10 * (i+j+1);
              var yHeight = screen.height/12  * (k+1);
              if (!Array.isArray(zone[k].site)){
                loadSites.push({group: "nodes", data: { id: zone[k].site.id, parent: zone[k].site.zoneid}, position: { x: xWidth, y: yHeight }, classes:'top-center' });
                siteLength = 1;
              }
              else {  
                siteLength = zone[k].site.length;   
                for (var a=0; a<siteLength; a++)
                  site.push(zone[k].site[a]); 
              }
              for (var m=0; m<siteLength; m++){
                if (siteLength > 1) {
                  loadSites.push({group: "nodes", data: { id: site[m].id, parent: site[m].zoneid}, position: { x: xWidth, y: yHeight }, classes:'top-center' });
                    site.push(zone[k].site[m]);
                }
              }
              site = [];
            }
            zone = [];
    }
}
    

function loadJsonInterZoneLinks(){
      
  if (Array.isArray(rs.interzonelinkbundle)) {
    for (i=0; i<rs.interzonelinkbundle.length; i++) {
      var zoneA = rs.interzonelinkbundle[i].zonea;
      var zoneB = rs.interzonelinkbundle[i].zoneb;
      interZoneLinks.push({group: "edges", data: { id: rs.interzonelinkbundle[i].id, source: findObjectByKey(zonesNumberNames, 'number', zoneA).id, 
                          target: findObjectByKey(zonesNumberNames, 'number', zoneB).id }});
    }
  }
}
    
function loadJsonIntraZoneLinks() {

  var mso = [];
    for (var i=0; i<cluster.length; i++){
      var msoLength;
      if (!Array.isArray(cluster[i].mso)){
        msoLength = 1;
        mso.push(cluster[i].mso);
      }
      else {
        var msoLength = cluster[i].mso.length;
        for (var a=0; a<cluster[i].mso.length; a++){
          mso.push(cluster[i].mso[a]);
        }
      }  
          
      for (var j=0; j<msoLength; j++){
        if ('intraZoneLink' in mso[j] === true) {  
          if (!Array.isArray(mso[j].intraZoneLink)) {
            var zoneA = mso[j].intraZoneLink.zoneAId;
            var zoneB = mso[j].intraZoneLink.zoneBId;
            intraZoneLinks.push({group: "edges", data: { id: mso[j].intraZoneLink.id, source: findObjectByKey(zonesNumberNames, 'number', zoneA).id, 
                            target: findObjectByKey(zonesNumberNames, 'number', zoneB).id }});
          }
          else {
            for (var k=0; k<mso[j].intraZoneLink.length; k++) {
              var zoneA = mso[j].intraZoneLink[k].zoneAId;
              var zoneB = mso[j].intraZoneLink[k].zoneBId;
              intraZoneLinks.push({group: "edges", data: { id: mso[j].intraZoneLink[k].id, source: findObjectByKey(zonesNumberNames, 'number', zoneA).id, 
                            target: findObjectByKey(zonesNumberNames, 'number', zoneB).id }});
            }
          }
        }
      }
      mso = [];
    }
  }  
  

var cy = window.cy = cytoscape({
  container: document.getElementById('cy'),
  boxSelectionEnabled: false,
  autounselectify: true,
 
  layout: {
    name: 'grid',
    cols: 5
  },

  style: [
  {
    selector: "node",
    style: {
      "height": 40,
      "width": 40,
      "background-color": "#afeeee",
      "label": "data(label)",
      "border-color": "black"
    }
  },  
  {
    selector: "edge",
    style: {
      "label": "data(label)",
      "width": 3,
      "line-color": "#000000"
    }
  },
  {
    selector: ".top-center",
    style: {
      "text-valign": "top",
      "text-halign": "center"
    }
  }
  ]
});

 //load edges
  loadJsonData();
  load(loadClusters);
  load(loadMSOs);
  load(loadZones);
  load(loadSites);

  loadJsonInterZoneLinks();
  load(interZoneLinks);

  loadJsonIntraZoneLinks();
  load(intraZoneLinks);
});
