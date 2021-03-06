var writer;
    $(document).ready(function(){      
            if (!Parse.User.current()){
              alert("你尚未登入");
              window.location = "index.html";
            }else if(Parse.User.current()){
                var a = setTimeout(function(){ 
                  FB.getLoginStatus(function(response) {
                    if (response.status === 'connected') {
                        uid = response.authResponse.userID;
                        accessToken = response.authResponse.accessToken;
                        FB.api('/me', function (response) {
                        writer=response['name'];
                                 });
                        FB.api('/me/picture?type=large', function (response) {
                             $('#dashboardImg').attr("src",response.data.url );          
                        });
                     
                        FB.api('/me', function (response) {
                              console.log(response);
                              $('#dashHi').text("HELLO , "+" "+response['first_name']);
                        });
                    }})},3000)}
              Setalbum();});

            $(document).on('click','#logoutBtn',function(e){
                e.preventDefault();
                logout();
                alert("登出成功");
                window.location = 'index.html' ;
            });

            function logout(){
               Parse.User.logOut();
               FB.logout(function(response) {
                 // user is now logged out
               });
            }
           
            $(document).on('submit','#photoForm',function(eventObject){
              eventObject.preventDefault();

              var Photo = Parse.Object.extend("Photo") ;
              var photosava = new Photo();

              photosava.set("writer",writer);
              photosava.set("owner",Parse.User.current());
              photosava.set("camera",$('#formcamera').val());
              photosava.set("style",$('#formstyle').val());
              photosava.set("tips",$('#formtips').val()); 

              if ($("#fileInput")[0].files.length > 0) {
               var file = $("#fileInput")[0].files[0];
               var name = "photo";
               var parseImg = new Parse.File(name, file);
               photosava.set("img",parseImg);
               parseImg.save({
               success : function (savedImg){
               },
               error : function (saveingImg , errorObject){
               alert(errorObject.message) ;
               }
               });
              }

              photosava.save(null,{
                success : function(savedParseObject){
                  alert("已經成功上傳!");
                  window.location.reload();
                },
                error : function (errorObject){
                  console.log(errorObject);
                  alert(errorObject.message);
                }
              });
            });

         function Setalbum(){
              var photomin=0,photomax=6,page=0;
                  GetPhoto();
                  function GetPhoto(){
                    var Photo = Parse.Object.extend("Photo") ;
                    var photo = new Photo();
                    var photoQuery = new Parse.Query(Photo);
                      photoQuery.equalTo("owner",Parse.User.current());

                        photoQuery.find({
                          success:function(photoArray){
                            console.log(photoArray);

                            photomin+=page;
                            photomax+=page;
                            
                            if(photoArray.length<=6){
                               photomin=0;
                               photomax=photoArray.length;}

                           if(photomin < 0){
                                photomin=0;
                                photomax=6;                             
                            }else if(photomax>=photoArray.length){
                                photomax=photoArray.length;
                                if(photomin>=photomax){
                                  photomin-=page;
                                }   
                                page=0;
                            }else if(photomax%6!=0){
                              photomax=photomin+6;
                            }
        
                            console.log(photomin);
                            console.log(photomax);
                        for(var i=photomin; i<photomax; i++){
                            photos=photoArray[i];
                            addphoto(
                            photos.get('camera'),
                            photos.get('style'),
                            photos.get('tips'),
                            photos.get('writer'),
                            photos.get('img').url(),
                            photonum=i%6+1
                            )
                          }
                          removephoto();
                        }
                        });  
                  };
                   
              $(document).on('click','#nextpage',function(e){
                  e.preventDefault();
                  page+=6;
                  GetPhoto();
                });

              $(document).on('click','#lastpage',function(e){
                  e.preventDefault();
                    page-=6;
                    GetPhoto();
                  });

                function addphoto(camera,style,tips,writer,img,photonum){
                  var modalname='#portfolioModal'+photonum,itemname='#portfolio-item'+photonum;
                 $(modalname).find('.writer').text(writer);
                 $(modalname).find('#app').text(camera);
                 $(modalname).find('#style').text(style);
                 $(modalname).find('.tip').text(tips);
                 $(modalname).find('.photo').attr("src",img);
                 $(itemname).show();
                 $(itemname).find('.photo').attr("src",img);
                 $(itemname).find('.photo').css({'max-height':'360px','max-width':'360px'});
               };
               function removephoto(){
                 if(photomax-photomin<6){
                  var i=0,itemname;
                  for(i=photomax-photomin+1;i<7;i++){
                    itemname='#portfolio-item'+i;
                 $(itemname).hide();
                 console.log("hide"+i);
                 console.log(itemname);
                  }
                }
               };
            };