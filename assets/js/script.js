
// remove the current values of textarea elements. It is nessary in case if user entered some value but never saved it. Otherwise entered value will appear in the textarea element
$('.description').val(''); 


$(document).ready(function() {
  
  // updetes current time every second to display real time change
  const updateTime = () => {
    setTimeout(renderCurrentDay, 1000);
  };

  
  // renders current day for the header
  const renderCurrentDay = () => {
    
    const currentDay = dayjs().format('dddd, MMM D,'); 
    const currentTime = dayjs().format(' 11:mm:ss A');
  
    $('#current-day').text(currentDay);
    $('#current-time').text(currentTime);
  
    updateTime();
  };


  // every second checks for current hour and if current hour has increased by 1 hour, updates color of the time blocks
  const updateBlockColor = () => {
    setTimeout(timeBlockColor, 1000);
  };


  // updates the color of time blocks based on the current time
  const timeBlockColor = () => {
    
    const currentHour =  11; //dayjs().format('H');
  
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
  
  
  // "save button" event listener saves the textarea data to the local storage
  $('.saveBtn').click(function() {
    
    const schedulerContent = JSON.parse(localStorage.getItem('schedulerContent') || '[]');
    
    const timeBlockContent = {
      timeBlockId: $(this).parent('.time-block').attr('id'),
      timeBlockText: $(this).siblings('.description').val(),
    };
    
    // removes saved value of the textarea if the user saves new value in the same textarea
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
  
  
  // retrives data from local storage and sets the existing value to the .time-block text area
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
  
  
  // event listener for "delete events" button
  $('#deleteBtn').click(function () {
    
    $('.description').val('');
    
    localStorage.clear();
  });
  
  
  // renders current day and time in the header
  renderCurrentDay();
  
  // retrieves data from the local storage and fills the associted time blocks with saved values
  renderSchedulerContent();

  // renders associated color of the time blocks based on the current time 
  timeBlockColor();
  
});
