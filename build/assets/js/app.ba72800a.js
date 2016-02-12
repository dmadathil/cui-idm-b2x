!function(angular){"use strict";angular.module("app",["translate","ngMessages","cui.authorization","cui-ng","ui.router","snap","LocalStorageModule"]).run(["$rootScope","$state","cui.authorization.routing",function($rootScope,$state,routing){}]),angular.module("app").factory("API",[function(){var myCUI=cui.api();myCUI.setServiceUrl("PRD");var doAuth=function(){return myCUI.doSysAuth({clientId:"wntKAjev5sE1RhZCHzXQ7ko2vCwq3wi2",clientSecret:"MqKZsqUtAVAIiWkg"})},token=function(){return myCUI.getToken()};return{token:token,cui:myCUI,doAuth:doAuth}}]),angular.module("app").controller("baseCtrl",["$state","getCountries","$scope","$translate",function($state,getCountries,$scope,$translate){var base=this;base.desktopMenu=!0,base.toggleDesktopMenu=function(){base.desktopMenu=!base.desktopMenu},base.goBack=function(){""!==$state.previous.name.name?$state.go($state.previous.name,$state.previous.params):$state.go("base")},base.generateHiddenPassword=function(password){return Array(password.length+1).join("•")},base.passwordPolicies=[{allowUpperChars:!0,allowLowerChars:!0,allowNumChars:!0,allowSpecialChars:!0,requiredNumberOfCharClasses:3},{disallowedChars:"^&*)(#$"},{min:8,max:18},{disallowedWords:["password","admin"]}];var setCountries=function(language){language=language||"en",language.indexOf("_")>-1&&(language=language.split("_")[0]),getCountries(language).then(function(res){base.countries=res.data})["catch"](function(err){console.log(err)})};$scope.$on("languageChange",function(e,args){setCountries(args)}),setCountries($translate.proposedLanguage())}]),angular.module("app").config(["$translateProvider","$locationProvider","$stateProvider","$urlRouterProvider","$injector","localStorageServiceProvider","$cuiIconProvider",function($translateProvider,$locationProvider,$stateProvider,$urlRouterProvider,$injector,localStorageServiceProvider,$cuiIconProvider){localStorageServiceProvider.setPrefix("cui"),$stateProvider.state("base",{url:"/",templateUrl:"assets/angular-templates/home.html",controller:"baseCtrl as base"}).state("users",{url:"/users",templateUrl:"assets/angular-templates/users/users.html"}).state("users.search",{url:"/",templateUrl:"assets/angular-templates/users/users.search/users.search.html",controller:"usersSearchCtrl as usersSearch"}).state("users.edit",{url:"/edit/:id",templateUrl:"assets/angular-templates/edit/users.edit/users.edit.html",controller:"usersEditCtrl as usersEdit"}).state("users.invitations",{url:"/invitations",templateUrl:"assets/angular-templates/invitations/users.invitations/users.invitations.search.html",controller:"usersInvitationsCtrl as usersInvitations"}).state("users.invite",{url:"/invite",templateUrl:"assets/angular-templates/invitations/users.invitations/users.invite.html",controller:"usersInviteCtrl as usersInvite"}).state("users.register",{url:"/register?id&code",templateUrl:"assets/angular-templates/registration/userInvited/users.register.html",controller:"usersRegisterCtrl as usersRegister"}).state("users.walkupRegistration",{url:"/walkupRegistration",templateUrl:"assets/angular-templates/registration/userWalkup/users.walkup.html",controller:"usersWalkupCtrl as usersWalkup"}).state("users.activate",{url:"/activate/:id",templateUrl:"assets/angular-templates/users/users.activate/users.activate.html",controller:"usersActivateCtrl as usersActivate"}).state("welcome",{url:"/welcome",templateUrl:"assets/angular-templates/welcome/welcome.html"}).state("welcome.screen",{url:"/welcome",templateUrl:"assets/angular-templates/welcome/welcome.screen.html",controller:"welcomeCtrl as welcome"}).state("tlo",{url:"/tlo",templateUrl:"assets/angular-templates/registration/newTopLevelOrg/topLevelOrg.html"}).state("tlo.registration",{url:"/registration",templateUrl:"assets/angular-templates/registration/newTopLevelOrg/topLevelOrg.registration/topLevelOrg.registration.html",controller:"tloCtrl as newTLO"}).state("division",{url:"/division",templateUrl:"assets/angular-templates/registration/newDivision/division.html"}).state("division.registration",{url:"/registration",templateUrl:"assets/angular-templates/registration/newDivision/division.registration/division.registration.html",controller:"divisionCtrl as newDivision"}).state("misc",{url:"/status",templateUrl:"assets/angular-templates/misc/misc.html"}).state("misc.404",{url:"/404",templateUrl:"assets/angular-templates/misc/misc.404.html"}).state("misc.notAuth",{url:"/notAuthorized",templateUrl:"assets/angular-templates/misc/misc.notAuth.html"}).state("misc.pendingStatus",{url:"/pendingStatus",templateUrl:"assets/angular-templates/misc/misc.pendingStatus.html"}).state("misc.success",{url:"/success",templateUrl:"assets/angular-templates/misc/misc.success.html"}),$urlRouterProvider.otherwise(function($injector){var $state=$injector.get("$state");$state.go("base")}),$translateProvider.useLoader("LocaleLoader",{url:"bower_components/cui-i18n/dist/cui-i18n/angular-translate/",prefix:"locale-",suffix:".json"}).fallbackLanguage("en_US"),$cuiIconProvider.iconSet("cui","bower_components/cui-icons/dist/icons/icons-out.svg",48,!0),$cuiIconProvider.iconSet("fa","bower_components/cui-icons/dist/font-awesome/font-awesome-out.svg",216,!0)}]),angular.module("app").run(["LocaleService","$rootScope","$state","$http","$templateCache",function(LocaleService,$rootScope,$state,$http,$templateCache){LocaleService.setLocales("en_US","English (United States)"),LocaleService.setLocales("pl_PL","Polish (Poland)"),LocaleService.setLocales("zh_CN","Chinese (Simplified)"),LocaleService.setLocales("pt_PT","Portuguese (Portugal)"),$rootScope.$on("$stateChangeSuccess",function(event,toState,toParams,fromState,fromParams){$state.previous={},$state.previous.name=fromState,$state.previous.params=fromParams});var icons=["bower_components/cui-icons/dist/icons/icons-out.svg","bower_components/cui-icons/dist/font-awesome/font-awesome-out.svg"];angular.forEach(icons,function(icon){$http.get(icon,{cache:$templateCache})})}]),angular.module("app").controller("usersEditCtrl",["localStorageService","$scope","$stateParams","$timeout","API",function(localStorageService,$scope,$stateParams,$timeout,API){var usersEdit=this;usersEdit.loading=!0,usersEdit.editName=!1,usersEdit.editAddress=!0;var selectQuestionsForUser=function(questionsArray,allQuestions){var questionTexts=[];angular.forEach(questionsArray,function(value){var text=_.find(allQuestions,function(question){return question.id===value});this.push(text.question[0].text)},questionTexts),usersEdit.user.challengeQuestion1=questionTexts[0],usersEdit.user.challengeQuestion2=questionTexts[1]};API.doAuth().then(function(res){return API.cui.getPerson({personId:$stateParams.id})}).then(function(res){return usersEdit.user=res,API.cui.getSecurityQuestionAccount({personId:usersEdit.user.id})}).then(function(res){var codes=_.map(res.questions,function(n){return n.question.id});return usersEdit.securityQuestionCodes=codes,$scope.$apply(),API.cui.getSecurityQuestions()}).then(function(res){var allSecurityQuestions=res;return $scope.$apply(),selectQuestionsForUser(usersEdit.securityQuestionCodes,allSecurityQuestions),API.cui.getPersonPassword({personId:usersEdit.user.id})}).then(function(res){usersEdit.userPassword=res,$scope.$apply(),usersEdit.loading=!1}).fail(function(err){$scope.$apply(),usersEdit.loading=!1}),usersEdit.save=function(){usersEdit.saving=!0,usersEdit.fail=!1,usersEdit.success=!1,API.cui.updatePerson({personId:$stateParams.id,data:usersEdit.user}).then(function(res){$timeout(function(){usersEdit.saving=!1,usersEdit.success=!0},300)}).fail(function(err){$timeout(function(){usersEdit.saving=!1,usersEdit.fail=!0},300)})},usersEdit.saveFullName=function(){usersEdit.user.name.given=usersEdit.tempGiven,usersEdit.user.name.surname=usersEdit.tempSurname,usersEdit.editName=!1}}]),angular.module("app").factory("getCountries",["$http",function($http){return function(locale){return $http.get("bower_components/cui-i18n/dist/cui-i18n/angular-translate/countries/"+locale+".json")}}]),angular.module("app").controller("usersInvitationsCtrl",["localStorageService","$scope","$stateParams","API","$timeout",function(localStorageService,$scope,$stateParams,API,$timeout){var usersInvitations=this;usersInvitations.listLoading=!0,usersInvitations.invitor=[],usersInvitations.invitee=[],usersInvitations.invitorLoading=[],usersInvitations.inviteeLoading=[],API.cui.getPersonInvitations().then(function(res){usersInvitations.listLoading=!1,usersInvitations.list=res,$scope.$apply()}).fail(function(err){usersInvitations.listLoading=!1,console.log(err)}),usersInvitations.getInfo=function(invitorId,inviteeId,index){void 0===usersInvitations.invitor[index]&&(usersInvitations.invitorLoading[index]=!0,usersInvitations.inviteeLoading[index]=!0,API.cui.getPerson({personId:invitorId}).then(function(res){usersInvitations.invitor[index]=res,$scope.$apply(),$timeout(function(){usersInvitations.invitorLoading[index]=!1},500)}).fail(function(err){console.log(err)}),API.cui.getPerson({personId:inviteeId}).then(function(res){usersInvitations.invitee[index]=res,$scope.$apply(),$timeout(function(){usersInvitations.inviteeLoading[index]=!1},500)}).fail(function(err){console.log(err)}))}}]),angular.module("app").controller("usersInviteCtrl",["localStorageService","$scope","Person","$stateParams","API",function(localStorageService,$scope,Person,$stateParams,API){var usersInvite=this;usersInvite.user={},usersInvite.user.organization={id:"OCOVSMKT-CVDEV204002",type:"organization",realm:"APPCLOUD"};var createInvitation=function(invitee){Person.createInvitation(invitee,{id:"RN3BJI54"}).then(function(res){sendInvitationEmail(res.data)})["catch"](function(err){usersInvite.sending=!1,usersInvite.fail=!0})},sendInvitationEmail=function(invitation){var text,message="You've received an invitation to join our organization.<p><a href='localhost:9001/#/users/register?id="+invitation.id+"&code="+invitation.invitationCode+"'>Click here to register</a>.";text=usersInvite.message&&""!==usersInvite.message?usersInvite.message+"<br/><br/>"+message:message;var emailOpts={to:invitation.email,from:"cuiInterface@thirdwave.com",fromName:"CUI INTERFACE",subject:"Request to join our organization",text:text};Person.sendUserInvitationEmail(emailOpts).then(function(res){usersInvite.sending=!1,usersInvite.sent=!0})["catch"](function(err){usersInvite.sending=!1,usersInvite.fail=!0})};usersInvite.saveUser=function(form){angular.forEach(form.$error,function(field){angular.forEach(field,function(errorField){errorField.$setTouched()})}),form.$valid&&(usersInvite.sending=!0,usersInvite.sent=!1,usersInvite.fail=!1,API.doAuth().then(function(){Person.create(usersInvite.user).then(function(res){createInvitation(res.data)})["catch"](function(err){usersInvite.sending=!1,usersInvite.fail=!0})}))}}]),angular.module("app").factory("Person",["$http","$q","API",function($http,$q,API){var getById=function(id){return $http({method:"GET",url:API.cui.getServiceUrl()+"/person/v1/persons/"+id,headers:{Accept:"application/vnd.com.covisint.platform.person.v1+json",Authorization:"Bearer "+API.token()}}).then(function(res){return res})["catch"](function(res){return $q.reject(res)})},getInvitations=function(){return $http({method:"GET",url:API.cui.getServiceUrl()+"/person/v1/personInvitations/",headers:{Accept:"application/vnd.com.covisint.platform.person.invitation.v1+json",Authorization:"Bearer "+API.token()}}).then(function(res){return res})["catch"](function(res){return $q.reject(res)})},getInvitationById=function(id){return $http({method:"GET",url:API.cui.getServiceUrl()+"/person/v1/personInvitations/"+id,headers:{Accept:"application/vnd.com.covisint.platform.person.invitation.v1+json",Authorization:"Bearer "+API.token()}}).then(function(res){return res})["catch"](function(res){return $q.reject(res)})},createInvitation=function(invitee,invitor){return $http({method:"POST",url:API.cui.getServiceUrl()+"/person/v1/personInvitations",headers:{Accept:"application/vnd.com.covisint.platform.person.invitation.v1+json",Authorization:"Bearer "+API.token(),"Content-type":"application/vnd.com.covisint.platform.person.invitation.v1+json"},data:{email:invitee.email,invitor:{id:invitor.id,type:"person"},invitee:{id:invitee.id,type:"person"},targetOrganization:{id:"OCOVSMKT-CVDEV204002",type:"organization"}}}).then(function(res){return res})["catch"](function(res){return $q.reject(res)})},update=function(id,data){return $http({method:"PUT",url:API.cui.getServiceUrl()+"/person/v1/persons/"+id,headers:{Accept:"application/vnd.com.covisint.platform.person.v1+json",Authorization:"Bearer "+API.token(),"Content-Type":"application/vnd.com.covisint.platform.person.v1+json"},data:data}).then(function(res){return res})["catch"](function(res){return $q.reject(res)})},create=function(data){return $http({method:"POST",url:API.cui.getServiceUrl()+"/person/v1/persons",headers:{Accept:"application/vnd.com.covisint.platform.person.v1+json",Authorization:"Bearer "+API.token(),"Content-Type":"application/vnd.com.covisint.platform.person.v1+json"},data:data}).then(function(res){return res})["catch"](function(res){return $q.reject(res)})},sendUserInvitationEmail=function(body){return $http({method:"POST",url:"http://localhost:8000/invitation/person","Content-Type":"application/json",data:body}).then(function(res){return res})["catch"](function(err){return $q.reject(err)})},getSecurityQuestions=function(){return $http({method:"GET",url:API.cui.getServiceUrl()+"/authn/v2/securityQuestions",headers:{Accept:"application/vnd.com.covisint.platform.securityquestion.v1+json",Authorization:"Bearer "+API.token()}}).then(function(res){return res})["catch"](function(err){return $q.reject(err)})},getPasswordAccount=function(id){return $http({method:"GET",url:API.cui.getServiceUrl()+"/person/v1/persons/"+id+"/accounts/password",headers:{Accept:"application/vnd.com.covisint.platform.person.account.password.v1+json",Authorization:"Bearer "+API.token()}}).then(function(res){return res})["catch"](function(err){return $q.reject(err)})},createPasswordAccount=function(id,data){return $http({method:"PUT",url:API.cui.getServiceUrl()+"/person/v1/persons/"+id+"/accounts/password",headers:{Accept:"application/vnd.com.covisint.platform.person.account.password.v1+json",Authorization:"Bearer "+API.token(),"Content-Type":"application/vnd.com.covisint.platform.person.account.password.v1+json"},data:data}).then(function(res){return res})["catch"](function(err){return $q.reject(err)})},createSecurityQuestions=function(id,data){return $http({method:"PUT",url:API.cui.getServiceUrl()+"/authn/v2/persons/"+id+"/accounts/securityQuestion",headers:{Accept:"application/vnd.com.covisint.platform.person.account.securityQuestion.v1+json",Authorization:"Bearer "+API.token(),"Content-Type":"application/vnd.com.covisint.platform.person.account.securityQuestion.v1+json"},data:data}).then(function(res){return res})["catch"](function(err){return $q.reject(err)})},grantExchangePackage=function(id){return $http({method:"PUT",url:API.cui.getServiceUrl()+"/service/v1/persons/"+id+"/packages/PCOVSMKT-CVDEV204003000",headers:{Accept:"application/vnd.com.covisint.platform.package.grant.v1+json",Authorization:"Bearer "+API.token(),"Content-Type":"application/vnd.com.covisint.platform.package.grant.v1+json"},data:{version:1,grantee:{id:id,type:"person"},servicePackage:{id:"PCOVSMKT-CVDEV204003000"}}}).then(function(res){return res})["catch"](function(err){return $q.reject(err)})},grantCcaPackage=function(id){return $http({method:"PUT",url:API.cui.getServiceUrl()+"/service/v1/persons/"+id+"/packages/PAPC2040605",headers:{Accept:"application/vnd.com.covisint.platform.package.grant.v1+json",Authorization:"Bearer "+API.token(),"Content-Type":"application/vnd.com.covisint.platform.package.grant.v1+json"},data:{version:1,grantee:{id:id,type:"person"},servicePackage:{id:"PAPC2040605"}}}).then(function(res){return res})["catch"](function(err){return $q.reject(err)})},person={getAll:API.cui.getUsers,getById:getById,update:update,getInvitations:getInvitations,create:create,createInvitation:createInvitation,sendUserInvitationEmail:sendUserInvitationEmail,getInvitationById:getInvitationById,getSecurityQuestions:getSecurityQuestions,getPasswordAccount:getPasswordAccount,createPasswordAccount:createPasswordAccount,createSecurityQuestions:createSecurityQuestions,grantCcaPackage:grantCcaPackage,grantExchangePackage:grantExchangePackage};return person}]),angular.module("app").controller("divisionCtrl",["$scope","API","Person",function($scope,API,Person){var newDivision=this;newDivision.userLogin={},newDivision.orgSearch={},newDivision.passwordPolicies=[{allowUpperChars:!0,allowLowerChars:!0,allowNumChars:!0,allowSpecialChars:!0,requiredNumberOfCharClasses:3},{disallowedChars:"^&*)(#$"},{min:8,max:18},{disallowedWords:["password","admin"]}],Person.getSecurityQuestions().then(function(res){res.data.splice(0,1);var numberOfQuestions=res.data.length,numberOfQuestionsFloor=Math.floor(numberOfQuestions/2);newDivision.userLogin.challengeQuestions1=res.data.slice(0,numberOfQuestionsFloor),newDivision.userLogin.challengeQuestions2=res.data.slice(numberOfQuestionsFloor),newDivision.userLogin.question1=newDivision.userLogin.challengeQuestions1[0],newDivision.userLogin.question2=newDivision.userLogin.challengeQuestions2[0]})["catch"](function(err){}),API.doAuth().then(function(){API.cui.getOrganizations().then(function(res){newDivision.organizationList=res})}).fail(function(err){console.log(err)});var searchOrganizations=function(){newDivision.orgSearch&&API.cui.getOrganizations({qs:[["name",newDivision.orgSearch.name]]}).then(function(res){newDivision.organizationList=res,$scope.$apply()}).fail(function(err){console.log(err)})};$scope.$watchCollection("newDivision.orgSearch",searchOrganizations)}]),angular.module("app").controller("tloCtrl",["$scope","API","Person",function($scope,API,Person){var newTLO=this;newTLO.userLogin={},newTLO.passwordPolicies=[{allowUpperChars:!0,allowLowerChars:!0,allowNumChars:!0,allowSpecialChars:!0,requiredNumberOfCharClasses:3},{disallowedChars:"^&*)(#$"},{min:8,max:18},{disallowedWords:["password","admin"]}],Person.getSecurityQuestions().then(function(res){res.data.splice(0,1);var numberOfQuestions=res.data.length,numberOfQuestionsFloor=Math.floor(numberOfQuestions/2);newTLO.userLogin.challengeQuestions1=res.data.slice(0,numberOfQuestionsFloor),newTLO.userLogin.challengeQuestions2=res.data.slice(numberOfQuestionsFloor),newTLO.userLogin.question1=newTLO.userLogin.challengeQuestions1[0],newTLO.userLogin.question2=newTLO.userLogin.challengeQuestions2[0]})["catch"](function(err){console.log(err)})}]),angular.module("app").controller("usersRegisterCtrl",["localStorageService","$scope","Person","$stateParams","API",function(localStorageService,$scope,Person,$stateParams,API){var usersRegister=this;usersRegister.loading=!0,usersRegister.userLogin={},usersRegister.registering=!1,usersRegister.registrationError=!1,usersRegister.signOn={},usersRegister.applications={},usersRegister.applications.numberOfSelected=0,usersRegister.showCovisintInfo=!1,usersRegister.passwordPolicies=[{allowUpperChars:!0,allowLowerChars:!0,allowNumChars:!0,allowSpecialChars:!0,requiredNumberOfCharClasses:3},{disallowedChars:"^&*)(#$"},{min:8,max:18},{disallowedWords:["password","admin"]}],Person.getInvitationById($stateParams.id).then(function(res){res.data.invitationCode===$stateParams.code&&getUser(res.data.invitee.id)})["catch"](function(err){console.log(err)});var getUser=function(id){API.cui.getPerson({personId:id}).then(function(res){usersRegister.loading=!1,usersRegister.user=res,$scope.$apply()}).fail(function(err){usersRegister.loading=!1,console.log(err)})};Person.getSecurityQuestions().then(function(res){res.data.splice(0,1);var numberOfQuestions=res.data.length,numberOfQuestionsFloor=Math.floor(numberOfQuestions/2);usersRegister.signOn.challengeQuestions1=res.data.slice(0,numberOfQuestionsFloor),usersRegister.signOn.challengeQuestions2=res.data.slice(numberOfQuestionsFloor),usersRegister.signOn.question1=usersRegister.signOn.challengeQuestions1[0],usersRegister.signOn.question2=usersRegister.signOn.challengeQuestions2[0]})["catch"](function(err){console.log(err)}),API.cui.getPackages().then(function(res){usersRegister.applications.list=res,$scope.$apply()}).fail(function(err){console.log(err)}),usersRegister.applications.updateNumberOfSelected=function(a){null!==a?usersRegister.applications.numberOfSelected++:usersRegister.applications.numberOfSelected--},usersRegister.applications.process=function(){if(usersRegister.applications.processedSelected)var oldSelected=usersRegister.applications.processedSelected;return usersRegister.applications.processedSelected=[],angular.forEach(usersRegister.applications.selected,function(app,i){null!==app&&usersRegister.applications.processedSelected.push({id:app.split(",")[0],name:app.split(",")[1],acceptedTos:oldSelected&&oldSelected[i]?oldSelected[i].acceptedTos:!1})}),usersRegister.applications.processedSelected.length},usersRegister.applications.searchApplications=function(){API.cui.getPackages({qs:[["name",usersRegister.applications.search]]}).then(function(res){console.log(typeofusersRegister.applications.search),console.log(res),usersRegister.applications.list=res,$scope.$apply()}).fail(function(err){console.log(err)})},usersRegister.applications.toggleCovisintInfo=function(){usersRegister.showCovisintInfo=!usersRegister.showCovisintInfo}}]),angular.module("app").controller("usersWalkupCtrl",["localStorageService","$scope","Person","$stateParams","API","LocaleService","$state",function(localStorageService,$scope,Person,$stateParams,API,LocaleService,$state){function handleError(err){console.log("Error!\n"),console.log(err)}var usersWalkup=this;usersWalkup.userLogin={},usersWalkup.applications={},usersWalkup.registering=!1,usersWalkup.registrationError=!1,usersWalkup.applications.numberOfSelected=0,localStorageService.get("usersWalkup.user")?usersWalkup.user=localStorageService.get("usersWalkup.user"):(usersWalkup.user={addresses:[]},usersWalkup.user.addresses[0]={streets:[]},usersWalkup.user.phones=[]),$scope.$watch("usersWalkup.user",function(a){a&&0!==Object.keys(a).length&&localStorageService.set("usersWalkup.user",a)},!0),API.doAuth().then(function(res){return API.cui.getSecurityQuestions()}).then(function(res){res.splice(0,1);var numberOfQuestions=res.length,numberOfQuestionsFloor=Math.floor(numberOfQuestions/2);return usersWalkup.userLogin.challengeQuestions1=res.slice(0,numberOfQuestionsFloor),usersWalkup.userLogin.challengeQuestions2=res.slice(numberOfQuestionsFloor),usersWalkup.userLogin.question1=usersWalkup.userLogin.challengeQuestions1[0],usersWalkup.userLogin.question2=usersWalkup.userLogin.challengeQuestions2[0],API.cui.getOrganizations()}).then(function(res){usersWalkup.organizationList=res}).fail(handleError);var searchOrganizations=function(newOrgToSearch){newOrgToSearch&&API.cui.getOrganizations({qs:[["name",newOrgToSearch.name]]}).then(function(res){usersWalkup.organizationList=res,$scope.$apply()}).fail(handleError)};$scope.$watchCollection("usersWalkup.orgSearch",searchOrganizations),$scope.$watch("usersWalkup.organization",function(newOrgSelected){newOrgSelected&&(usersWalkup.applications.numberOfSelected=0,usersWalkup.applications.processedSelected=void 0,API.cui.getPackages({qs:[["owningOrganization.id",newOrgSelected.id]]}).then(function(res){0===res.length?usersWalkup.applications.list=void 0:usersWalkup.applications.list=res,$scope.$apply()}).fail(handleError))}),usersWalkup.applications.updateNumberOfSelected=function(checkboxValue){null!==checkboxValue?usersWalkup.applications.numberOfSelected++:usersWalkup.applications.numberOfSelected--},usersWalkup.applications.process=function(){if(usersWalkup.applications.processedSelected)var oldSelected=usersWalkup.applications.processedSelected;return usersWalkup.applications.processedSelected=[],angular.forEach(usersWalkup.applications.selected,function(app,i){null!==app&&usersWalkup.applications.processedSelected.push({id:app.split(",")[0],name:app.split(",")[1],acceptedTos:oldSelected&&oldSelected[i]?oldSelected[i].acceptedTos:!1})}),usersWalkup.applications.processedSelected.length},usersWalkup.applications.searchApplications=function(){API.cui.getPackages({qs:[["name",usersWalkup.applications.search],["owningOrganization.id",usersWalkup.organization.id]]}).then(function(res){usersWalkup.applications.list=res,$scope.$apply()}).fail(handleError)},usersWalkup.submit=function(){usersWalkup.submitting=!0;var user,org;API.cui.createPerson({data:build.user()}).then(function(res){return user=res,API.cui.getOrganization({organizationId:user.organization.id})}).then(function(res){return org=res,API.cui.createSecurityQuestionAccount(build.userSecurityQuestionAccount(user))}).then(function(){return API.cui.createPersonPassword(build.personPassword(user,org))}).then(function(){return API.cui.createPersonRequest(build.personRequest(user,org))}).then(function(){usersWalkup.submitting=!1,usersWalkup.success=!0,console.log("userCreated."),$state.go("misc.success")}).fail(function(err){usersWalkup.success=!1,handleError(err)})};var build={personRequest:function(user,org){return{data:{id:user.id,registrant:{id:user.id,type:"person",realm:org.realm},justification:"User walkup registration.",servicePackageRequest:this.packageRequests()}}},packageRequests:function(){var packages={packageId:usersWalkup.applications.selected[0].split(",")[0]};return packages},personPassword:function(user,org){return{personId:user.id,data:{version:"1",username:usersWalkup.userLogin.username,password:usersWalkup.userLogin.password,passwordPolicy:org.passwordPolicy,authenticationPolicy:org.authenticationPolicy}}},userSecurityQuestionAccount:function(user){return{personId:user.id,data:{version:"1",id:user.id,questions:this.userSecurityQuestions(user)}}},user:function(){return usersWalkup.user.addresses[0].country=usersWalkup.userCountry.title,usersWalkup.user.organization={id:usersWalkup.organization.id},usersWalkup.user.timezone="EST5EDT",usersWalkup.user.phones[0]&&(usersWalkup.user.phones[0].type="main"),LocaleService.getLocaleCode().indexOf("_")>-1?usersWalkup.user.language=LocaleService.getLocaleCode().split("_")[0]:usersWalkup.user.language=LocaleService.getLocaleCode(),usersWalkup.user},userSecurityQuestions:function(user){return[{question:{id:usersWalkup.userLogin.question1.id,type:"question",realm:user.realm},answer:usersWalkup.userLogin.challengeAnswer1,index:1},{question:{id:usersWalkup.userLogin.question2.id,type:"question",realm:user.realm},answer:usersWalkup.userLogin.challengeAnswer2,index:2}]}}}]),angular.module("app").controller("usersActivateCtrl",["$stateParams","API","Person",function($stateParams,API,Person){var personParams=[{name:"personId",value:$stateParams.id}];API.cui.activatePerson({params:personParams}).then(function(res){return Person.grantCcaPackage($stateParams.id)}).then(function(res){return Person.grantExchangePackage($stateParams.id)}).then(function(res){console.log(res)}).fail(function(err){console.log(err)})}]),angular.module("app").controller("usersSearchCtrl",["localStorageService","$scope","API","Person",function(localStorageService,$scope,API,Person){var usersSearch=this;usersSearch.listLoading=!0,API.doAuth().then(function(){API.cui.getPersons().then(function(res){usersSearch.listLoading=!1,usersSearch.list=res,usersSearch.list.splice(0,4),$scope.$apply()}).fail(function(err){usersSearch.listLoading=!1})});var search=function(){usersSearch.search&&(console.log(usersSearch.search),API.cui.getPersons({data:usersSearch.search}).then(function(res){usersSearch.list=res,$scope.$apply()}).fail(function(err){}))};$scope.$watchCollection("usersSearch.search",search)}]),angular.module("app").controller("welcomeCtrl",["$scope",function($scope){}])}(angular);