export function setCookie(cookieName: String, cookieValue: String, expireDays = -1) {
  if (expireDays < 0) {
    document.cookie = cookieName + "=" + cookieValue + ";path=/";
  } else {
    var date = new Date();
    date.setTime(date.getTime() + expireDays * 1440 * 60 * 1000);
    var expires = "expires=" + date.toUTCString();
    document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
  }
}

export function getCookie(cookieName: String) {
  var name = cookieName + "=";
  var cookies = document.cookie.split(";");
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return "";
}

export function deleteCookie(cookieName: String) {
  setCookie(cookieName, "", 0);
}
