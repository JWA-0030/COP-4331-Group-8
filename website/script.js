var urlBase = 'https://managebandageapi.azurewebsites.net';

var username = "";

function doLogin()
{

    var login = document.getElementById("inputUsername").value; //  .value gets input from "email" textbox
    var password = document.getElementById("inputPassword").value; //  .value gets input from password textbox

    document.getElementById("loginResult").innerHTML = "";

    var jsonPayload = '{"UserID" : "' + login + '", "Password" : "' + password + '"}';
    var url = urlBase + '/UserLogin';

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, false); // synchronous causes network error, gonna leave as asynchronous
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try
    {

        xhr.send(jsonPayload); // sends to server, used for POST requests

        var jsonObject = JSON.parse(xhr.responseText);

         if(jsonObject == null)
         {
             document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
             alert("login failed");
             return;
         } else {
            window.name = login;
          //  alert(window.name);
            window.location.href = "contacts.html";
        }

    //     document.getElementById("inputEmail").value = ""; // resets text boxes
    //     document.getElementById("inputPassword").value = "";

    }
    catch(err)
    {
        document.getElementById("loginResult").innerHTML = err.message;
        alert(err);
    }

}

function validateNumber(number)
{
    if(number.toString().length == 10){
        return true;
    }else{
        alert("Invalid phone number");
        return false;
    }
}

function validateEmail(email) 
{
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(re.test(String(email).toLowerCase()))
    {
        return true;
    }else{
        alert("Invalid email address");
        return false;
    }
}


function addContact()
{
    var newFirstName = document.getElementById("First Name").value;
    var newLastName = document.getElementById("Last Name").value;
    var newPhoneNumber = document.getElementById("Phone Number").value;
    var newEmail = document.getElementById("Email Address").value;
    
    if(validateNumber(newPhoneNumber) && validateEmail(newEmail))
    {   
        var jsonPayload = '{ "UserID" : "' + window.name + '", "FirstName" : "' + newFirstName + '", "LastName" : "' + newLastName + '", "PhoneNumber" : "' + newPhoneNumber + '", "Email" : "' + newEmail + '" }';
        var url = urlBase + '/SaveContact';
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, false);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        
        try
        {
            xhr.onreadystatechange = function()
            {
                if(this.readyState == 4 && this.status == 200)
                {
                    alert("Contact added");
                }
            };
            xhr.send(jsonPayload);
            
        } catch (err){
            alert(err);
        }

        // Clear the add contact user to prepare to add others
        document.getElementById("signin-form").reset();
        // Reload the table
        getContacts();
    }    
}

function createUser() {
  var newUsername = document.getElementById("inputUsername").value;
  var newPassword = document.getElementById("inputPassword").value;

  var jsonPayload = '{"UserID" : "' + newUsername + '", "Password" : "' + newPassword + '"}';
  var url = urlBase + '/CreateUser';
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, false);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try
  {
      xhr.onreadystatechange = function()
      {
        if(this.readyState == 4 && this.status == 200)
        {
          alert("Account created");
          window.name = newUsername;
          window.location.href = "contacts.html";
        }
      };
      xhr.send(jsonPayload);
  } catch (err) {
    alert(err);
  }

}

function getContacts() {
  var toBeDeleted ="";
  var jsonPayload = '{"UserID" : "' + window.name + '", "Password" : "' + "" + '"}';
  var url = urlBase + '/GetContacts';
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, false);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try
  {

      xhr.send(jsonPayload); // sends to server, used for POST requests

      var jsonObject = JSON.parse(xhr.responseText);
      jsonObject = JSON.parse(jsonObject);

  }
  catch(err)
  {
      document.getElementById("loginResult").innerHTML = err.message;
      alert(err);
  }


  var html = '';
  for(var i in jsonObject)
  {
    html += '<tr id="'+i+'">';
    html += '<td>'+jsonObject[i]["ContactID"]+'</td>';
    html += '<td>'+jsonObject[i]["FirstName"]+'</td>';
    html += '<td>'+jsonObject[i]["LastName"]+'</td>';
    html += '<td>'+jsonObject[i]["PhoneNumber"]+'</td>';
    html += '<td>'+jsonObject[i]["Email"]+'</td>';
    html += '<td><button class="btn btn-primary" onclick="getButtonIndex()">Delete</button></td></tr>';
    html += '</tr>';
  }
  $('#contactsData > tbody').html(html);

}

function getButtonIndex()
{
    $('td').click(function()
    {
        var row_index = $(this).parent().index();
        // console.log(row_index);
        deleteContact(row_index);
        return false;        
    });
}

function deleteContact(i) {

    var jsonPayload = '{"UserID" : "' + window.name + '", "Password" : "' + "" + '"}';
    var url = urlBase + '/GetContacts';
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, false);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    var jsonObject;

    try
    {
        xhr.send(jsonPayload); // sends to server, used for POST requests
        jsonObject = JSON.parse(xhr.responseText);
        jsonObject = JSON.parse(jsonObject);
    }
    catch(err)
    {
        alert(err);
    }
  
  if(confirm("Are you sure you want to delete this contact?"))
  {
   
   
    // Prepare payloard
    var del_contactID = jsonObject[i]["ContactID"];
    var del_FirstName = jsonObject[i]["FirstName"];
    var del_LastName = jsonObject[i]["LastName"];
    var del_PhoneNumber = jsonObject[i]["PhoneNumber"];
    var del_Email = jsonObject[i]["Email"];
    var s = "Yeet " + del_FirstName + " outta here!";
    var jsonPayload2 = '{ "UserID" : "' + window.name + '", "FirstName" : "' + del_FirstName + '", "LastName" : "' + del_LastName + '", "PhoneNumber" : "' + del_PhoneNumber + '", "Email" : "' + del_Email + '", "ContactID" : "'  + del_contactID + '" }';
    alert(s);
    
    // Send payload
    var url2 = urlBase + '/DeleteContact';
    var xhr2 = new XMLHttpRequest();
    xhr2.open("DELETE", url2, false);
    xhr2.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try
    {

      xhr2.send(jsonPayload2); 

    }
    catch(err)
    {
      alert(err);
    }
    
    
    // force reload 
    getContacts();

  }
}

function searchContacts() {

  var search = document.getElementById("Search").value;

  var contactList = document.getElementById("contactList");
  contactList.innerHTML = "";


  var jsonPayload = '{"UserID" : "' + window.name + '", "FirstName" : "' + search + '", "LastName" : "' + "" + '", "PhoneNumber" : "' + "" + '", "Email" : "' + "" + '", "ContactID" : "' + '' + '"}';
  var url = urlBase + '/SearchContacts';


  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, false);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try
  {
    xhr.onreadystatechange = function()
    {
      if (this.readyState == 4 && this.status == 200)
      {

        var jsonObject = JSON.parse( xhr.responseText );

        jsonObject = JSON.parse(jsonObject);

        var i;
        for( i=0; i<jsonObject.length; i++ )
        {
          var opt = document.createElement("option");
          opt.text = jsonObject[i]["FirstName"] + " " +jsonObject[i]["LastName"];
          opt.value = "";
          contactList.options.add(opt);
        }
      }
    };
    xhr.send(jsonPayload);
  }
  catch(err)
  {
    alert(err);
  }
}

function filterRows()
{
 $(document).ready(function(){
   $("#searchBox").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#contactsData tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      });
    });
  }); 
}
