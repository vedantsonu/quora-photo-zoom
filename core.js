
     var doc = document.documentElement;

     var div = document.createElement( 'img' );
     var switchBtn = document.createElement( 'img' );
     var temp = document.createElement( 'div' );

     var winWidth = window.innerWidth;
     var winHeight = window.innerHeight;

     var firstTouch = true;

     var curWidth = 0;
     var curHeight = 0;
     var top1 = 0;
     var left = 0;  

     var SHOW = 1;   

    //append all elements
    document.body.appendChild( div );
    document.body.appendChild( switchBtn );
    document.body.appendChild( temp );

       //set attributes for div
    div.id = 'ImageID';
    div.style.position = 'fixed';     
    div.style.border ='4px solid white';
    div.style.boxShadow = '0px 1px 0.7em black';
    div.style.zIndex='999';

    switchBtn.id = 'switchID';
    switchBtn.style.position = 'fixed';    
    switchBtn.style.boxShadow = '0px 1px 0.3em black';
    switchBtn.src = chrome.extension.getURL('icon.png');
    switchBtn.style.top = winHeight/2+'px';
    switchBtn.style.left = '0px';
    switchBtn.style.width = '30px';
    switchBtn.style.height = '30px';
    switchBtn.onclick = function() {
      if(SHOW == 1){
        temp.textContent = 'Quora Photo Zoom[OFF]';
        switchBtn.src = chrome.extension.getURL('icon_black.png');
      }
      else
      {
        temp.textContent = 'Quora Photo Zoom[ON]';
        switchBtn.src = chrome.extension.getURL('icon.png');
      }
      SHOW *= -1;
    };
          
    temp.id = 'switchInfoID';
    temp.style.position = 'fixed';
    temp.style.left = '20px';
    temp.style.top = winHeight/2 - 25 +'px'; 
    temp.style.background = 'black';
    temp.style.color = "white";
    temp.style.padding = "3px";
    temp.textContent = 'Quora Photo Zoom[ON]';
    temp.style.visibility='hidden';

    // Mouse listener for any move event on the current document.
    document.addEventListener('mousemove', function (e) 
    {

      var srcElement = e.srcElement;

      toggleSwitchHint(srcElement);
        
        // Element below the cursor
      if(SHOW == 1){        

      var mouseX = e.pageX - (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
      var mouseY = e.pageY - (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
        
      // check if our cursor is over an IMG and it has class qtext_image
      if (( (srcElement.nodeName == 'IMG' || srcElement.nodeName == 'DIV') 
      && (srcElement.classList.contains('qtext_image')|| srcElement.classList.contains('profile_photo_img')) ) 
      || srcElement.id == 'ImageID') {
      
          setZoomedImage(srcElement);          

          // var aspectRatio = div.width/div.height ; 
          div.onload = function(){
            setImgPosAndSize(mouseX,mouseY);
          };
          div.style.visibility = 'visible';
            

          if( firstTouch == true && div.complete)
          {
             curWidth = div.width;
             curHeight = div.height;
             firstTouch = false;
          }

            // set position of our image div based on cursor position and imageheight
          setImgPosAndSize(mouseX,mouseY);         
          
          // temp.textContent = (winWidth - mouseX) +' '+ div.width + ' ' + div.height + ' ' + winHeight + ' ' + winWidth + ' '+ aspectRatio+' '+top1+' '+left+ ' '+mouseY ;

        }
        
        else
        {
            
            
        }
    }

    }, false);

    function resetVariables()
    {
        div.style.visibility = 'hidden';
        div.src = chrome.extension.getURL('download.gif');
        div.style.background = 'white';
        div.style.width = '';
        div.style.height = '';
        firstTouch = true;
        curWidth=0;
        curHeight=0; 
    }

    function toggleSwitchHint(srcElement)
    {
      if(srcElement.id == 'switchID')
        {
            temp.style.visibility ='visible';
        }
        else
        {
            temp.style.visibility = 'hidden';
        }
    }

    function setZoomedImage(srcElement)
    {
      // gets the bigger image from the imge over which the cursor is and sets it ib our image block
          if ( srcElement.classList.contains('profile_photo_img') ) 
          {
              div.src = srcElement.getAttribute("src").replace('-'+srcElement.getAttribute('width')+'-','-200-');
          }
          else if( srcElement.classList.contains('qtext_image'))
          {
              div.src = srcElement.getAttribute("master_src");
          }
    }


    function setImgPosAndSize(mouseX, mouseY){
      var aspectRatio = div.width/div.height;
      var avlSpace = winWidth - mouseX -30;
      var avlSpaceY = winHeight - 100;     

      if((curWidth >  avlSpace) || (curHeight > avlSpaceY))
      {
          if( avlSpace/aspectRatio < avlSpaceY){
              div.style.width = avlSpace +'px';
              div.style.height = avlSpace/aspectRatio +'px';
            }
        else if(curHeight > avlSpaceY){
              div.style.height = avlSpaceY +'px';
              div.style.width = avlSpaceY*aspectRatio +'px';
              top1 = 70;
              }
        }

        left = mouseX + 10;
        if( mouseY + div.height/2 > winHeight - 20)
        {
           top1 = winHeight - div.height - 20;

        }
       else if(mouseY - div.height/2 < 70){
            top1 =  70;
        }
       else {
            top1  = mouseY -div.height/2;
        }

        div.style.left = left+'px';
        div.style.top = top1 +'px';
    }


