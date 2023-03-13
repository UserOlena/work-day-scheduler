// clear the existing values of the textarea elements to ensure that any unsaved user input does not appear in the textarea.
$('.description').val(''); 


$(document).ready(function() {
  
  // update the current time every second to display real-time changes.
  const updateTime = () => {
    setTimeout(renderCurrentDay, 1000);
  };

  
  // display the current day in the header.
  const renderCurrentDay = () => {
    
    const currentDay = dayjs().format('dddd, MMM D,'); 
    const currentTime = dayjs().format(' h:mm:ss A');
  
    $('#current-day').text(currentDay);
    $('#current-time').text(currentTime);
  
    updateTime();
  };


  // check the current hour every second, and if the current hour has increased by one hour, update the color of the time blocks.
  const updateBlockColor = () => {
    setTimeout(timeBlockColor, 1000);
  };


  // update the color of the time blocks based on the current time.
  const timeBlockColor = () => {
    
    const currentHour =  dayjs().format('H');
  
    $('.time-block').each(function () {
  
      const timeBlockColor = parseInt($(this).attr('id'));
      
      if (timeBlockColor < currentHour) {
        $(this).removeClass('present');
        $(this).removeClass('future');
        $(this).addClass('past'); 
      } else if (timeBlockColor == currentHour) {
        $(this).removeClass('past');
        $(this).removeClass('future');
        $(this).addClass('present');
      } else if (timeBlockColor > currentHour) {
        $(this).removeClass('present');
        $(this).removeClass('past');
        $(this).addClass('future');     
      } else {
        console.log('There was a problem looping though the .time-block class elements.');
      }
    });
   
    updateBlockColor();
  };
  
  
  // add an event listener to the "save" button that saves the textarea data to the local storage.
  $('.saveBtn').click(function() {
    
    const schedulerContent = JSON.parse(localStorage.getItem('schedulerContent') || '[]');
    
    const timeBlockContent = {
      timeBlockId: $(this).parent('.time-block').attr('id'),
      timeBlockText: $(this).siblings('.description').val(),
    };
    
    // remove the previously saved value of the textarea if the user saves a new value in the same textarea.
    if (schedulerContent.length > 0) {
      for (let i = 0; i < schedulerContent.length; i++) {
        if (schedulerContent[i].timeBlockId === timeBlockContent.timeBlockId) {
          schedulerContent.splice(i, 1);
        }
      }
    };
      
    schedulerContent.push(timeBlockContent)
    localStorage.setItem('schedulerContent', JSON.stringify(schedulerContent));

  });
  
  
  // retrieve data from local storage and set the existing value to the textarea of the ".time-block".
  const renderSchedulerContent = () => {
    
    const schedulerContent = JSON.parse(localStorage.getItem('schedulerContent') || '[]');
    
    if (schedulerContent.length > 0) {
      
      $(schedulerContent).each(el => {
        
        $('.time-block').each(function() {
          
          const timeBlockId = $(this).attr('id');
          
          if (timeBlockId === schedulerContent[el].timeBlockId) {
            
            $(`#${timeBlockId}`).children('.description').val(schedulerContent[el].timeBlockText)
          }
        })
      })
    }
  };
  
  
  // add an event listener for the "delete events" button.
  $('#deleteBtn').click(function () {
    
    $('.description').val('');
    
    localStorage.clear();
  });
  
  
  // display the current day and time in the header.
  renderCurrentDay();
  
  // fetching information from the local storage and populating the relevant time slots with the stored data.
  renderSchedulerContent();

  // assigns the appropriate color to the time blocks based on the present time.
  timeBlockColor();
  
});
