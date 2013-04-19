var gHrefRecommender="http://recommender.bibtip.de/recommender/reclist";
var cssFileName = 'bibtip_default.css';
var catalog='GBV';
var SHORT_LIST_LEN_LOCAL = 5;
var SHORT_LIST_LEN_CROSS = 3;
var customUILanguage = 'German';
var customHeaderText = null;
var labels = new Object();
    labels[catalog] = '';

if(typeof window.addEventListener != 'undefined') {
    window.addEventListener('load', init_bibtip, false);
} else if(typeof document.addEventListener != 'undefined') {
    document.addEventListener('load', init_bibtip, false);
} else if(typeof window.attachEvent != 'undefined') {
    window.attachEvent('onload', init_bibtip);
}


function init_bibtip(){
  var tags = document.getElementsByTagName("div");
  var match = null;
  for (var i=0;i<tags.length;i++) {
    matches = tags[i].id.match(/bibtip_id.*/gi);
    if (matches != null) { 
      suffix = matches[0].substring(9);
      isxn=getBibtipISXN(suffix);
      shortTitle=getBibtipShortTitle(suffix);
      nd=getBibtipNd(suffix);
      checkForRecs(isxn,shortTitle,nd,suffix);   
    }
  }
}

function getBibtipNd(suffix){
	var element = document.getElementById('bibtip_id'+suffix);
  if (element) {
    return getContent(element);
  }
	return "";
};

function getBibtipShortTitle(suffix){
	var element = document.getElementById('bibtip_shorttitle'+suffix);
  if (element) {
    var result = getContent(element);
    return decodeURIComponent(result.replace(/\+/g,' '));
  }
	return "";
}

function getBibtipISXN(suffix){
	var element = document.getElementById('bibtip_isxn'+suffix);
  if (element) {
    return getContent(element);
  }
	return "";
}

function getFbt(){
  var result = document.URL.match(/&fbt=[0-9]{7}/);
  if (result != null) {
    return result[0];
  }
  return "";
}

function getUILanguage(){
  return customUILanguage;
}

function checkForRecs(isxn,shortTitle,nd,suffix){
  var params="isxns="+isxn;
  params+="&title="+encodeURIComponent(shortTitle);
  params+="&nd="+nd;
  //params+="&test=";
  params +=getFbt();
  params+="&url="+encodeURIComponent(document.URL);
  params+="&referer="+encodeURIComponent(document.referrer);
  params+="&suffix="+suffix;
  params+="&language="+getUILanguage();
  if (nd.length > 3) {
    insertScriptSrc(gHrefRecommender+"/"+catalog.toLowerCase()+"/"+nd+".js?"+params);
  }     
}



function insertScriptSrc(src){
  var scriptElement=document.createElement("script");
  scriptElement.setAttribute("src",src);
  var bodyElement=document.getElementsByTagName("body")[0];
  bodyElement.appendChild(scriptElement);
  ////setTimeout("checkResponse()",5000);
}



function showCompleteList(suffix,destination){
  document.getElementById('short_list' + suffix + '_' + destination).style.display = 'none';
  document.getElementById('long_list' + suffix + '_' + destination).style.display = 'block';
  document.getElementById('bibtip_more_button' + suffix + '_' + destination).style.display = 'none';
}


function showRecs(reclist){
  recs = reclist.recs
  suffix = reclist.suffix
  if(recs.length > 0) {
    if (cssFileName) {
      var cssLink = document.createElement('link'); 
      cssLink.setAttribute('rel','stylesheet');
      cssLink.setAttribute('href','http://recommender.bibtip.de/service/'+cssFileName);
      cssLink.setAttribute('type','text/css');
      document.getElementsByTagName("head")[0].appendChild(cssLink);
    }
    var recDiv = document.getElementById("bibtip_reclist"+suffix);
    if (recDiv) {
      var destinations = [];
      var i = 0;      
      var j = 0;
      var found = false;
      for (i = 0; i < recs.length; i++) {
        found = false;
        for (j = 0; j < destinations.length; j++) {
          if (destinations[j] == recs[i].catalog) {
            found = true;
          }
        }
        if (found == false) {
          destinations = destinations.concat(recs[i].catalog);
        }
      }
      var recs_target = [];
      var newHeader;
      var SHORT_LIST_LENGTH;
      var shortList;
      var longList;
      var newButton;
      var newAnchor;
      for (j = 0; j < destinations.length; j++) {
        recs_target = [];
        for (i = 0; i < recs.length; i++) {
          if (recs[i].catalog == destinations[j]) {
            recs_target.push(recs[i]);
          }
        }
        newHeader = createHeader(suffix,destinations[j]);
        recDiv.appendChild(newHeader);
        if (destinations[j] == catalog) { 
          SHORT_LIST_LENGTH = SHORT_LIST_LEN_LOCAL;
        } else {
          SHORT_LIST_LENGTH = SHORT_LIST_LEN_CROSS;
        }
        shortList = createList(recs_target,'short_list' + suffix + '_' + destinations[j],SHORT_LIST_LENGTH);
        longList = createList(recs_target,'long_list' + suffix + '_' + destinations[j],100);
        longList.style.display='none';
        recDiv.appendChild(shortList);
        recDiv.appendChild(longList);
        if (recs_target.length > SHORT_LIST_LENGTH) {
          newButton = document.createElement("div");
          newButton.setAttribute('id','bibtip_more_button' + suffix + '_' + destinations[j]);
          newButton.setAttribute('class','bibtip_more_button');
          newAnchor = document.createElement("a");
          newAnchor.setAttribute("href",'javascript:showCompleteList("'+suffix+'", "'+destinations[j]+'")');
          var language = getUILanguage()
          if (language == 'German') {
            newAnchor.appendChild(document.createTextNode('mehr ...'));
          } else if (language == 'French') {
            newAnchor.appendChild(document.createTextNode('plus ...'));
          } else if (language == 'Italian') {
            newAnchor.appendChild(document.createTextNode('più ...'));
          } else if (language == 'Spanish') {
            newAnchor.appendChild(document.createTextNode('más ...'));
          } else {
            newAnchor.appendChild(document.createTextNode('more ...'));
          }
          newButton.appendChild(newAnchor);
          recDiv.appendChild(newButton);
        }
        recDiv.style.display='block';
      }
    }
  }
}

function createHeader(suffix,destination){
  var newHeader = document.createElement("div");
  newHeader.setAttribute('id','bibtip_header' + suffix + '_' + destination);
  newHeader.setAttribute('class','bibtip_header');
  var newLogo = document.createElement("span");
  newLogo.setAttribute('id','bibtip_logo' + suffix + '_' + destination);
  var newImage=document.createElement("img");
  newImage.setAttribute('alt','BibTip-Homepage');
  newImage.setAttribute("src",'http://recommender.bibtip.de/service/bibtip_logo.png');
  newImage.setAttribute("border",'0');
  var newAnchor = document.createElement("a");
  newAnchor.setAttribute("href","http://www.bibtip.com");
  newAnchor.setAttribute("target","blank");
  newAnchor.appendChild(newImage);
  newLogo.appendChild(newAnchor);
  newHeader.appendChild(newLogo);
  var newTitle = document.createElement("span");
  newTitle.setAttribute('id','bibtip_title' + suffix + '_' + destination);
  newTitle.setAttribute('class','bibtip_title');
  if (customHeaderText != null) {
    newTitle.appendChild(document.createTextNode(customHeaderText + labels[destination] + ":"));
  } else {
    var language = getUILanguage();
    if (language == 'German') {
      newTitle.appendChild(document.createTextNode(" Andere Benutzer fanden auch interessant" + labels[destination] + ":"));
    } else if (language == 'French') {
      newTitle.appendChild(document.createTextNode(" D'autres utilisateurs ont également été intéressés par" + labels[destination] + ":"));
    } else if (language == 'Italian') {
      newTitle.appendChild(document.createTextNode(" Altri utenti sono anche stati interessati da" + labels[destination] + ":"));
    } else if (language == 'Spanish') {
      newTitle.appendChild(document.createTextNode(" Quienes vieron esta obra también consultaron" + labels[destination] + ":"));
    } else {
      newTitle.appendChild(document.createTextNode(" Other users were also interested in" + labels[destination] + ":"));
    }
  }
  newHeader.appendChild(newTitle);
  return newHeader;
}

function createList(recs,listId,lengthLimit){
  var newDiv= document.createElement("div");
  newDiv.setAttribute("id",listId);
  newDiv.setAttribute("class","bibtip_list");
  var newList = document.createElement("ul");
  newDiv.appendChild(newList);
  for (var i = 0; (i < recs.length) && (i < lengthLimit); i++) {
    var newLi = document.createElement("li");
    newLi.setAttribute("id","reclink");
    var newAnchor = document.createElement("a");
    var entry = recs[i];
    newAnchor.setAttribute("href",entry.link);
    newAnchor.setAttribute("style","vertical-align:middle");
    newAnchor.appendChild(document.createTextNode(entry.description));
    newLi.appendChild(newAnchor);
    newList.appendChild(newLi);
  }
  return newDiv;
}


function getContent(element){
  var text_concat = '';
  if(element.nodeType==3) {
    // text node
    str = element.data;
    return str;
  } else {
    // element node
    var children=element.childNodes;
    var numChildren=children.length;
    for(var i=0;i<children.length;i++) {
      text_chunk = getContent(children[i]);
      if (text_chunk.length > 0) {
        text_concat = text_concat + text_chunk;
      }
    }
  }
  return text_concat.replace(/^\s+|\s+$/g, '');
}

