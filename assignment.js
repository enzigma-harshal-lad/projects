
document.write("Using From Local Static Resources");

//FOR MAKING localhost path ALLOWED
    var app = angular.module('myApp', []);  
    app.config(function($sceDelegateProvider) {
      $sceDelegateProvider.resourceUrlWhitelist([
                  'self',
                  'https://localhost/**',
      ]);
    });

//DIRECTIVE FOR GETTING OBJECT RELATED FILED-LIST
    app.directive('objectList', function () {
     return {
                link : fieldFunction,   
                templateUrl: 'https://localhost/test-dev/template/objectListTemplate.html',
                scope: false,
                controller: function($scope, $element) {
                  $scope.showFields = function(){
                   // attributes.sObjectName = $scope.selectedItem;
                    //CALLING APEX METHOD TO GET OBJECT-RALATED ALL FIELDS
                    listAllObjects.getObjectFields($scope.selectedItem,function(result,event){
                      if(event.status){
                          $scope.resultFieldList=result;                                             
                          $scope.$apply();   
                          $scope.getAllChildObj($scope.selectedItem);                                       
                      }
                    });
                  } ,

                  //To get all CHILD object list
                  $scope.getAllChildObj=function(objName){ 
                      listAllObjects.getChildObject(objName,function(result,event){           
                        if(event.status){
                            $scope.resultChildObjList=result;                                             
                            $scope.$apply();                                           
                          }
                      });                                          
                    } ,
                 
                  //FOR GETTING THE VALUES OF ALL SELECTED FIELDS
                    $scope.fetchField=function(){     
                      debugger;      
                    var str='';
                    $scope.fieldSet = new Array();
                    var count=0;
                    var arrIndex=0;
                    for (i=0;i<idFieldList.length;i++) { 
                      if(idFieldList[i].selected && idFieldList[i].value !=""){
                            str +=idFieldList[i].value.substring(7)+",";
                            $scope.fieldSet[arrIndex] = idFieldList[i].value.substring(7);
                            arrIndex++;
                            count++;
                        }
                      }  
                      if(count>7){
                        $scope.errFieldLimit = "You can select maximum field 7";
                        $scope.data = null;
                        $scope.fieldSet = null;
                      }
                      else{
                        $scope.errFieldLimit = "";
                        var  queryField = str.substr(0,str.length-1);
                        $scope.fetchRecords(queryField,idObjList.value.substring(7));
                      }                                      
                  },

              //TO FETCH ALL RECORDS
                $scope.fetchRecords=function(strField,sObj){ 
                  //passing fields and object name as parameter
                  debugger;
                      listAllObjects.getAllRecords(strField,sObj,function(result,event){
                      if(event.status){
                        $scope.data = result;
                        $scope.fieldSet = [];
                        angular.forEach(Object.getOwnPropertyNames($scope.data[0]), function(value, key) {
                          $scope.fieldSet.push(value);
                        });   
                        $scope.$apply();                                            
                      }
                      else{
                        alert("No Records Found");
                      }
                  });                                          
                }              
                }
            }; 

            function fieldFunction($scope,element,attributes){            
              attributes.sObjectName = $scope.selectedItem;
             }      
    });

//CUSTOM DIRECTIVE
   app.directive('objectFieldLst', function () {
      return {
                 templateUrl: 'https://localhost/test-dev/template/objectFieldLstTemplate.html',
                 scope: {
                   objectLst : '@',
                   sObjectName : '@',
                   fieldLst : '='
                 },
                 controller: function($scope, $element) {  
                    //TO GET OBJECTS
                      $scope.getObj = function(){
                          alert('In getObj()');
                          $scope.objList = new Array();
                          $scope.objList[0] = 'account';
                          $scope.objList[1] = 'job__c';
                          $scope.objectLst = $scope.objList;
                      }
                      //To get all object list
                      $scope.getAllObjName=function(){ 
                            listAllObjects.getObjectNames(function(result,event){
                              if(event.status){
                                  $scope.resultObjList=result;                                             
                                  $scope.$apply();                                           
                              }
                          });                                          
                      },

                      //CALLING APEX METHOD TO GET OBJECT-RALATED ALL FIELDS
                      $scope.showFields = function(){
                        $scope.sObjectName =  $scope.selectedItem;
                        alert('obj : '+$scope.sObjectName);
                         listAllObjects.getObjectFields($scope.sObjectName,function(result,event){
                           if(event.status){
                               $scope.resultFieldList=result;                                             
                               $scope.$apply(); 
                           }
                         });                
                       } 
                 }
             }; 
 
            //  function fieldFunction($scope,element,attributes){ 
            //         alert('hello');           
            //       attributes.sObjectName = 'job__c';
            //         alert('Name : '+attributes.sObjectName);
            //   }      
     });
    
//CONTROLLER TO INITIALLY LOAD THE TEMPLATES
  app.controller('customersCtrl', function($scope) {                     
        $scope.homePageTemplate = 'https://localhost/test-dev/template/homePageTemplate.html'
       

        
 });
  