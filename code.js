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


fetch('test.json', {mode: 'no-cors'})
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
    var interZoneLinks = [];
    var zonesNumberNames = [];
    
    var width = screen.width;
    var height = screen.height;
    
    function loadJsonData() {
      var clusterLength;
      if (!Array.isArray(rs.cluster))  {
        loadClusters.push({group: "nodes", data: { id: rs.cluster.id} });
        clusterLength = 1;
      }
      else 
        clusterLength = rs.cluster.length;
      for (var i=0; i<clusterLength; i++){
        if (clusterLength > 1){
          loadClusters.push({group: "nodes", data: { id: rs.cluster[i].id} });
        }
    
          var msoLength;
          if (!Array.isArray(rs.cluster[i].mso)){
            if (clusterLength == 1)
              loadMSOs.push({group: "nodes", data: { id: rs.cluster.mso.id, parent: rs.cluster.id} });
            else
              loadMSOs.push({group: "nodes", data: { id: rs.cluster[i].mso.id, parent: rs.cluster[i].id} });
            msoLength = 1;
          }
          else 
            msoLength = rs.cluster[i].mso.length;
          for (var j=0; j<msoLength; j++){
            if (msoLength > 1){
              if (clusterLength == 1)
                loadMSOs.push({group: "nodes", data: { id: rs.cluster.mso[j].id, parent: rs.cluster.id} });
              else 
                loadMSOs.push({group: "nodes", data: { id: rs.cluster[i].mso[j].id, parent: rs.cluster[i].id} });
            }
          }
              var zoneLength;
              if (!Array.isArray(rs.cluster[i].zone)){
                if (clusterLength == 1) {
                  loadZones.push({group: "nodes", data: { id: rs.cluster.zone.id, parent: rs.cluster.zone.msoid, name: rs.cluster.zone.name, label: rs.cluster.zone.name} });
                  zonesNumberNames.push({id: rs.cluster.zone.id, number: rs.cluster.zone.number});
                }
                else {
                  loadZones.push({group: "nodes", data: { id: rs.cluster[i].zone.id, parent: rs.cluster[i].zone.msoid, name: rs.cluster[i].zone.name, label: rs.cluster[i].zone.name} });
                  zonesNumberNames.push({id: rs.cluster[i].zone.id, number: rs.cluster[i].zone.number});
                }
                  zoneLength = 1;
              }
              else
                zoneLength = rs.cluster[i].zone.length;
              for (var k=0; k<zoneLength; k++){
                if (zoneLength > 1) {
                  if (clusterLength == 1) {
                    loadZones.push({group: "nodes", data: { id: rs.cluster.zone[k].id, parent: rs.cluster.zone[k].msoid, name: rs.cluster.zone[k].name, label: rs.cluster.zone[k].name} });
                    zonesNumberNames.push({id: rs.cluster.zone[k].id, number: rs.cluster.zone[k].number});
                  }  
                  else { 
                    loadZones.push({group: "nodes", data: { id: rs.cluster[i].zone[k].id, parent: rs.cluster[i].zone[k].msoid, name: rs.cluster[i].zone[k].name, label: rs.cluster[i].zone[k].name} });
                    zonesNumberNames.push({id: rs.cluster[i].zone[k].id, number: rs.cluster[i].zone[k].number});
                  }
                }
    
                  var siteLength;
                  var xWidth = width/10 * (i+j+1);
                  var yHeight = height/12  * (k+1);
                  if (!Array.isArray(rs.cluster[i].zone[k].site)){
                    if (zoneLength == 1){
                      if (clusterLength == 1)
                        loadSites.push({group: "nodes", data: { id: rs.cluster.zone.site.id, parent: rs.cluster.zone.id}, position: { x: xWidth, y: yHeight }, classes:'top-center' });
                      else 
                        loadSites.push({group: "nodes", data: { id: rs.cluster[i].zone.site.id, parent: rs.cluster[i].zone.id}, position: { x: xWidth, y: yHeight }, classes:'top-center' });
                    }
                    else {
                      if (clusterLength == 1)
                        loadSites.push({group: "nodes", data: { id: rs.cluster.zone[k].site.id, parent: rs.cluster.zone[k].id}, position: {x: xWidth, y: yHeight }, classes:'top-center' });
                      else 
                        loadSites.push({group: "nodes", data: { id: rs.cluster[i].zone[k].site.id, parent: rs.cluster[i].zone[k].id}, position: { x: xWidth, y: yHeight }, classes:'top-center' });
                    }
                    siteLength = 1;
                  }
                  else  
                    siteLength = rs.cluster[i].zone[k].site.length;
                  for (var m=0; m<siteLength; m++){
                    if (siteLength > 1) {
                      if (zoneLength == 1) {
                        if (clusterLength == 1) {
                          loadSites.push({group: "nodes", data: { id: rs.cluster.zone.site[m].id, parent: rs.cluster.zone.id}, position: { x: xWidth, y: yHeight }, classes:'top-center' });
                        }
                        else {
                          loadSites.push({group: "nodes", data: { id: rs.cluster[i].zone.site[m].id, parent: rs.cluster.zone.id}, position: { x: xWidth, y: yHeight }, classes:'top-center' });
                        }
                      }
                      else {
                        if (clusterLength == 1) {
                          loadSites.push({group: "nodes", data: { id: rs.cluster.zone[k].site[m].id, parent: rs.cluster.zone[k].id}, position: { x: width/4*(i+1), y: height/2*(k+1) }, classes:'top-center' });
                        }
                        else {
                          loadSites.push({group: "nodes", data: { id: rs.cluster[i].zone[k].site[m].id, parent: rs.cluster[i].zone[k].id}, position: { x: width/4*(i+1), y: height/2*(k+1) }, classes:'top-center' });
                        }
                    }
                  }
              }
      }
    }
    }

    function loadJsonLinks(){
      if (Array.isArray(rs.interzonelinkbundle)) {
        for (i=0; i<rs.interzonelinkbundle.length; i++) {
          var zoneA = rs.interzonelinkbundle[i].zonea;
          var zoneB = rs.interzonelinkbundle[i].zoneb;
          interZoneLinks.push({group: "edges", data: { id: rs.interzonelinkbundle[i].id, source: findObjectByKey(zonesNumberNames, 'number', zoneA).id, 
                              target: findObjectByKey(zonesNumberNames, 'number', zoneB).id }});
        }
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

      style: 
        [
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
        "line-color": "#ccc"
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



  loadJsonData();
  load(loadClusters);
  load(loadMSOs);
  load(loadZones);
  load(loadSites);

  loadJsonLinks();
  load(interZoneLinks);
});

