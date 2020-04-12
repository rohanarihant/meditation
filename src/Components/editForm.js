import React from 'react';

const editReport = (props) => {
  const tempDate = new Date(props.editData.data);
  const tempMonth = tempDate.getMonth()+1;
  const formatDate = `${tempDate.getFullYear()}-${tempMonth < 10 ? '0'+tempMonth : tempMonth}-${tempDate.getDate()}`
  return(
    <div>
  <form>
    <label for="fname">Name</label>
    <input type="text" id="name" name="name" value={props.editData.name} onChange={props.updateEditData} placeholder="Your name.." />

    <label for="lname">Phone</label>
    <input type="text" id="phone" name="phone" value={props.editData.phone} onChange={props.updateEditData} placeholder="Your last name.." />

    <label for="lname">Date</label><br />
    <input type="Date" id="date" value={formatDate} name="date"  onChange={props.updateEditData} placeholder="Your last name.." /><br />
  
    <label for="lname">Duration</label>
    <input type="text" id="duration" name="duration" value={props.editData.duration} onChange={props.updateEditData} placeholder="Your last name.." />
  
    <input type="button" value="Submit" onClick={props.updateReport} />
  </form>
</div>
  )
}

export default editReport;