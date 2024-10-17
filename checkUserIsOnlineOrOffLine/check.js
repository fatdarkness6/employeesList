function checkUserOnline(props) {
    if (!navigator.onLine) {
      props.value = true
      alert('لطفا به اینترنت متصل باشید')
      return;
    }else {
      props.value = false
    }
  }
  export {checkUserOnline}