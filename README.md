in this project, we mimic the contacts application.

get request '/' - read the contacts and diaply the contacts as json.

post request - write the data to the contacts file.

delete request - deletes the contact.


...........................................

optimisation:

while getting the contact information, we are traversing the entire contacts object. which will take the o(n) complexity n the worst cases.

we can improvise this by creating mutliple files for saving the data based on the first letter from the firstName. 
assume a-m letter contacts saved to file1.
rest of the letters saved to file2.

searchby phone number - will save in another file 
{'9123123123': 'file1'}
