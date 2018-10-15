
document.write("Using Local Static Resources");

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
      function fieldFunction($scope,element,attributes){
            $scope.showFields = function(){
              attributes.sObjectName = $scope.selectedItem;
              
              //CALLING APEX METHOD TO GET OBJECT-RALATED ALL FIELDS
              listAllObjects.getObjectFields(attributes.sObjectName,function(result,event){
                if(event.status){
                    $scope.resultFieldList=result;                                             
                    $scope.$apply();                                           
                }
              });
            },
            
            $scope.getRecordFieldValue = function (record,field){
              debugger;
            }
      }
      return {
          link : fieldFunction,
          templateUrl: 'https://localhost/test-dev/template/objectListTemplate.html',
          scope: true
      };
    });


//CONTROLLER TO INITIALLY LOAD THE TEMPLATES
  app.controller('customersCtrl', function($scope) {   
        $scope.homePageTemplate = "https://localhost/test-dev/template/homePageTemplate.html";
            
        //To get all object list
        $scope.getAllObjName=function(){           
          listAllObjects.getObjectNames(function(result,event){
            if(event.status){
                $scope.resultObjList=result;                                             
                $scope.$apply();                                           
            }
          });                                          
        }
        
        //FOR GETTING THE VALUES OF ALL SELECTED FIELDS
        $scope.fetchField=function(){           
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
        }

    //TO FETCH ALL RECORDS
        $scope.fetchRecords=function(strField,sObj){ 
          //passing fields and object name as parameter
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

 });
  