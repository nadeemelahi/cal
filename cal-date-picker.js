/* author Nadeem Elahi 2017 nadeem.elahi@gmail.com */
"use strict";
function dce(tag){
   return document.createElement(tag);
}
function dctn(tx){
   return document.createTextNode(tx);
}
function emptyNode($){
   while($.firstChild) $.removeChild($.firstChild);
}
/* Calendar html template dynamically created upon instantiate 
 * <div id="cal">
 * <nav><header><section> siblings/children of div#cal
 * nav: <div><div><div>
 *                    1-button label button ie. < mo >
 *                    2.-button label button ie. - yr +
 *                    3. text inpute name=dateInputString
 *  header:<label>7 for seven days ie. mon tue ...
 *  section: <time>x42 for six wks ie. 1,2,3..31
 */
function Cal($){
   this.$cal = $; 
   this.$$t = [];
   this.months = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
   //monthsL: ["january","february","march","april","may","june","july","august","september","october","november","december"],
   this.days = ["sun","mon","tue","wed","thu","fri","sat"]; 
   //daysL = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"]
   this.today = new Date();
   this.todayBkup = new Date(this.today.getTime()); //need incase change month/year and return back to same current/today month
   //this.timestamp = this.today.getTime(); //
   //this.day = this.today.getDay(); // [0-6] starting from sun
   //this.date = this.today.getDate(); // [1-31]
   //this.month = this.today.getMonth(); // [0-11]
   //this.year = this.today.getFullYear(); // yyyy
   //this.hr = this.today.getHours(); // [0-23]
   //this.min = this.today.getMinutes(); // [0.59]

   //this.offset = this.day; //back to sun

   //this.firstOfMonth = new Date();
   //this.firstOfMonth.setFullYear( this.year, this.month, 1);
   this.buildNavHeader(); // < mo >   12 jan 2017  < yr >
   this.buildDaysColumnHeader(); // mon tue wed 
   this.build6x7timeNodes(); //1,2,3,..30
   this.fill42dates( this.today.getDate(),   //day month year
	 this.today.getMonth(), this.today.getFullYear() ); 
};
Cal.prototype.buildNavHeader = function(){
   //next prev years & months and 
   this.i = null;
   var $nh = dce("nav");
   var $left = dce("div");
   var $middle = dce("div");
   var $right = dce("div");

   var $prevYearBtn = dce("button");
   $prevYearBtn.type = "button";
   $prevYearBtn.appendChild( dctn(" - ") );

   var $nextYearBtn = dce("button");
   $nextYearBtn.type = "button";
   $nextYearBtn.appendChild( dctn(" + ") );

   var $yearLabel = dce("label");
   $yearLabel.appendChild( dctn("yr") );

   $left.appendChild($prevYearBtn);
   $left.appendChild($yearLabel);
   $left.appendChild($nextYearBtn);

   this.dateinput = dce("input"); // in form 14 jan 2017
   this.dateinput.type = "text";
   this.dateinput.name = "dateInputString";
   this.dateinput.value = this.today.getDate() +" "+ (this.months[ this.today.getMonth()  ]) +" "+ this.today.getFullYear();

   $middle.appendChild(this.dateinput);

   var $prevMonthBtn = dce("button");
   $prevMonthBtn.type = "button";
   $prevMonthBtn.appendChild( dctn(" < ") );

   var $nextMonthBtn = dce("button");
   $nextMonthBtn.type = "button";
   $nextMonthBtn.appendChild( dctn(" > ") );

   var $monthLabel = dce("label");
   $monthLabel.appendChild( dctn( "mo" ) );

   $right.appendChild($prevMonthBtn);
   $right.appendChild($monthLabel);
   $right.appendChild($nextMonthBtn);

   $nh.appendChild($right);
   $nh.appendChild($left);
   $nh.appendChild($middle);
   this.$cal.appendChild($nh);

};
Cal.prototype.buildDaysColumnHeader = function(){
   var dch = dce("header");
   var label;
   for (this.i = 0; this.i<7; this.i++){
      label = dce("label");
      label.appendChild( dctn( this.days[this.i] ) );
      dch.appendChild(label);
   }
   this.$cal.appendChild(dch);
};
Cal.prototype.build6x7timeNodes = function(){
   var t42sect = dce("section");
   for(this.i=0;this.i<42;this.i++){
      this.$$t.push( dce("time") );
      //this.$$t[this.i].id = "tpos" + (this.i).toString();

      t42sect.appendChild(this.$$t[this.i]);
   }
   this.$cal.appendChild(t42sect);
};
Cal.prototype.setOneOf42dates = function(i,date){
   //console.log('i,date', i, date);
   this.$$t[i].appendChild( dctn(date) );
};

Cal.prototype.fill42dates = function(date,month,yr){
   //[1-31], [10-11], yyyy
   var firstDayOfMonth = new Date( ((month+1).toString()) +"/01/"+ yr );
   
   //console.log(firstDayOfMonth.getDate(), firstDayOfMonth.getDay());
   var offset = firstDayOfMonth.getDay(); // [0-6] for sun,mon,...
   console.log(offset);
   var current = new Date();
   current.setDate( (firstDayOfMonth.getDate()) - offset); //firstSunOnCal
   console.log(current.getDate() );
   var lastDayOfMonth = new Date();
   lastDayOfMonth.setDate(1);
   lastDayOfMonth.setMonth(lastDayOfMonth.getMonth() + 1);
   lastDayOfMonth.setDate(lastDayOfMonth.getDate() - 1);

   for(this.i=0; this.i<offset; this.i++){
      this.setOneOf42dates( this.i,current.getDate() );
      current.setDate( (current.getDate()) + 1 );
      this.$$t[this.i].className = "disabled"; // disabled clasName not used for css just for selecting/marking
      //so when click happen we can check if className is disabled and ignore/return
      this.$$t[this.i].style.opacity = 0.6;;
   }
   for(this.i; this.i<( (lastDayOfMonth.getDate()) + offset); this.i++){
      this.setOneOf42dates( this.i,(current.getDate()) );
      current.setDate( (current.getDate()) + 1 );
   }
   for(this.i;this.i<42;this.i++){
      this.setOneOf42dates( this.i,current.getDate() );
      current.setDate( (current.getDate()) + 1 );
      this.$$t[this.i].className = "disabled";
      this.$$t[this.i].style.opacity = 0.6;;
   }
   //var testparse = Date.parse( this.dateinput.value );
   //console.log("tested parse: " + testparse);
};
/*Cal.prototype.checkDateInputFormat = function(dateString){
   var params = dateString.split(" "); // 16 jun 2017

   var yyyy = parseInt(parms[2], 10);
   if (yyyy < 1900) { return false; }

   var mm = parseInt(parms[1], 10);
   if (mm < 1 || mm > 12) { return false; }

   var dd = parseInt(parms[0], 10);
   if (dd < 1 || dd > 31) { return false; }

   var dateCheck = new Date(yyyy, mm - 1, dd);
   return (dateCheck.getDate() === dd && (dateCheck.getMonth() === mm - 1) && dateCheck.getFullYear() === yyyy);
};*/
//Cal.prototype.setDateInput = function(){
//here we can change the date in form 14 jan 2017
//this.dateinput.value = this.today.getDate() +" "+ (this.months[this.today.getMonth()]) +" "+ this.today.getFullYear();
// with params date,mo,yr
//};
Cal.prototype.resetDateInput = function(){
   console.log('resetDateInput');
   this.clear42TimeEls();
   this.fill42dates( //date,month,yr
	 (this.today.getDate()), 
	 (this.today.getMonth()),
	 (this.today.getFullYear()) );
   // this.buildNavHeader
   this.dateinput.value = this.today.getDate() +" "+ (this.months[this.today.getMonth()]) +" "+ this.today.getFullYear();
   this.today.setTime(this.today.getTime());
   /* UPDATE FOR MAKING Cal class work as a date picker -the DatePickerToggle object 2places*/
   DatePickerToggle.setDate(this.today.getDate(), (this.months[this.today.getMonth()]), this.today.getFullYear());
};
Cal.prototype.clear42TimeEls = function(){
   for(this.i=0;this.i<42;this.i++){
      emptyNode( this.$$t[this.i] );
      this.$$t[this.i].style.opacity = 1;
      this.$$t[this.i].className = "";
   }
};
//Cal.prototype.dateInputChange = function(e){ 
   //var textInputDate = this.dateinput.value;
//};
Cal.prototype.yearPlusIncr = function(e){
   this.today.setFullYear( (this.today.getFullYear() + 1) );
   this.resetDateInput();
};
Cal.prototype.yearMinusIncr = function(e){
   this.today.setFullYear( (this.today.getFullYear() - 1) );
   this.resetDateInput();
};
Cal.prototype.monthNextIncr = function(e){
   this.today.setMonth( (this.today.getMonth() + 1) );
   if( this.today.getMonth() == this.todayBkup.getMonth() && 
	 this.today.getFullYear() == this.todayBkup.getFullYear() ){

      this.today.setDate(this.todayBkup.getDate());
   } else {
      this.today.setDate(1);
   }
   this.resetDateInput();
};
Cal.prototype.monthPrevIncr = function(e){
   this.today.setMonth( (this.today.getMonth() - 1) );
   if( this.today.getMonth() == this.todayBkup.getMonth() &&
	    this.today.getFullYear() == this.todayBkup.getFullYear() ) {

      this.today.setDate(this.todayBkup.getDate());
   } else {
      this.today.setDate(1);
   }
   this.resetDateInput();
};
Cal.prototype.changeDateOfMonth = function(e){
   if(e.target.className == "disabled"){ return; } 
   var d = new Date( this.today.getTime() );
   var changeDate = e.target.textContent;
   d.setDate(changeDate);
   // this.buildNavHeader
   this.dateinput.value = d.getDate() +" "+ (this.months[d.getMonth()]) +" "+ d.getFullYear();
   this.today.setTime(d.getTime());
   this.today.getDate();
   /* UPDATE FOR MAKING Cal class work as a date picker -the DatePickerToggle object 2places*/
   DatePickerToggle.setDate(this.today.getDate(), (this.months[this.today.getMonth()]), this.today.getFullYear());
};

var DatePickerToggle = new function(){

   //var img$toggleDatePicker = document.getElementById("toggleDatePicker");
   var input$datePickED = document.getElementById("datePickED");
   var div$container = document.getElementById("container");

   var visibility = 0; //not visible


   this.click = function(){
      if(visibility) {
	 div$container.style.visibility = "hidden";
      } else { 
	 div$container.style.visibility = "visible";
      }
      visibility ^= 1;
   };

   var d;
   this.setDate = function(dd, mmm, yyyy){
      input$datePickED.value = dd +" "+ mmm +" "+ yyyy; 
   };

}

window.addEventListener("load", app, false);
function app(){
   var $cal = document.getElementById("cal");
   var cal = new Cal($cal);
   /* function registerKeyUpH(e){
      if (!e) var e = window.event;
      if (e.target.type == "text"){
	 cal.dateInputChange(e);
      } else { console.log("unknow event", e); }
   } */
   function registerClickH(e){
      if (!e) var e = window.event;
      if (e.target.id == "toggleDatePicker"){
	 DatePickerToggle.click();
      } else if (e.target.type == "button"){
	 //console.log(e.target.textContent);
	 var action = e.target.textContent;
	 if(action == " + "){  cal.yearPlusIncr(e); } 
	 else if(action == " - "){ cal.yearMinusIncr(e); } 
	 else if(action == " > "){ cal.monthNextIncr(e); } 
	 else if(action == " < "){ cal.monthPrevIncr(e); }
	 else { console.log("unknown button click", e); }

      } else if (e.target.nodeName.toLowerCase() == "time"){ 
	 //type is not definted, just had a datetime attribute
	 //console.log(e.target.textContent);
	 cal.changeDateOfMonth(e);
      } else { console.log("unknow event", e.target); }
   } 

   window.addEventListener("click",registerClickH,false);
   //window.addEventListener("keyup",registerKeyUpH,false);
}
