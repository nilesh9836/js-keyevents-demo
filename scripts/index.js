
let keyCodeList = [];
let keydownOn = true;
let keypressOn = true;
let keyupOn = true;

$(document).ready(function(e) {
  $.getJSON( "../keycode.json" , function( result ){
    keyCodeList = result;
    console.log({keyCodeList});

    for (let counter = 0; counter <= keyCodeList.length - 1; counter++) {
      //const curIndx = document.getElementById("key-code-table-body").rows.length;
      const row = document.getElementById("key-code-table-body").insertRow();
      const cell0 = row.insertCell(0);
      cell0.innerHTML = `<span>${keyCodeList[counter]['Key Name']}</span>`;

      const cell1 = row.insertCell(1);
      cell1.innerHTML = `<span>${keyCodeList[counter]['event.which']}</span>`;

      const cell2 = row.insertCell(2);
      cell2.innerHTML = `<span>${keyCodeList[counter]['event.key']}</span>`;

      const cell3 = row.insertCell(3);
      cell3.innerHTML = `<span>${keyCodeList[counter]['event.code']}</span>`;

      const cell4 = row.insertCell(4);
      cell4.innerHTML = `<span>${keyCodeList[counter]['Notes']}</span>`;
    }
  });
});

function getModifierState(event) {
  let modifier = "";
  if (
    event.getModifierState("ScrollLock") ||
    event.getModifierState("Scroll")
  ) {
    modifier = modifier + "ScrollLock" + " ";
  }
  if (event.getModifierState("Control")) {
    modifier = modifier + "Control" + " ";
  }
  if (event.getModifierState("Alt")) {
    modifier = modifier + "Alt" + " ";
  }
  if (event.getModifierState("Meta")) {
    modifier = modifier + "Meta" + " ";
  }
  if (event.getModifierState("Shift")) {
    modifier = modifier + "Shift" + " ";
  }
  if (event.getModifierState("NumLock")) {
    modifier = modifier + "NumLock" + " ";
  }
  if (event.getModifierState("CapsLock")) {
    modifier = modifier + "CapsLock" + " ";
  }

  return modifier;
}

function addRow(event) {
  document.getElementById("key-id").innerHTML = `<mark>${event.key}</mark>`;
  const curIndx = document.getElementById("event-table-body").rows.length;
  const row = document.getElementById("event-table-body").insertRow(curIndx);
  const data = [
    event.type,
    event.which,
    event.keyCode,
    event.charCode,
    event.key,
    event.code,
    event.shiftKey,
    event.altKey,
    event.ctrlKey,
    event.metaKey,
    getModifierState(event),
  ];
  for (let counter = 0; counter <= data.length - 1; counter++) {
    const cell = row.insertCell(counter);
    cell.innerHTML = `<span class='v-${data[counter]}'>${data[counter]}</span>`;
  }
  window.scrollTo(0, document.body.scrollHeight);
}

const clearAll = (event) => {
  document.getElementById("event-table-body").innerHTML = "";
  document.getElementById("key-id").innerHTML = "";
};

document.addEventListener("keydown", function (event) {
  keydownOn && addRow(event);
});

document.addEventListener("keyup", function (event) {
  keyupOn && addRow(event);
});

document.addEventListener("keypress", function (event) {
  keypressOn && addRow(event);
});

document
  .getElementById("clear-all-id")
  .addEventListener("click", function (event) {
    clearAll(event);
});

document
  .getElementById("see-details-id")
  .addEventListener("click", function (event) {
    if (typeof keyCodeDialog.showModal === "function") {
      keyCodeDialog.showModal();
    } else {
      console.warn("The <dialog> API is not supported by this browser");
      $('#dialog-warning').show();
    }
});

document
  .getElementById("keydown-cb-id")
  .addEventListener("click", function (event) {
    keydownOn = document.getElementById("keydown-cb-id").checked;
});

document
  .getElementById("keypress-cb-id")
  .addEventListener("click", function (event) {
    keypressOn = document.getElementById("keypress-cb-id").checked;
});

document
  .getElementById("keyup-cb-id")
  .addEventListener("click", function (event) {
    keyupOn = document.getElementById("keyup-cb-id").checked;
});

document
  .getElementById("export-to-csv")
  .addEventListener("click", function (event) {
    exportJSONToCSV(keyCodeList);
});

document
  .getElementById("download-csv-link")
  .addEventListener("click", function (event) {
    exportJSONToCSV(keyCodeList);
});

function closeDialig() {
  document.getElementById('keyCodeDialog').close();
}

function exportJSONToCSV(objArray) {
  var arr = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
  var str =
    `${Object.keys(arr[0])
      .map((value) => `"${value}"`)
      .join(',')}` + '\r\n';
  var csvContent = arr.reduce((st, next) => {
    st +=
      `${Object.values(next)
        .map((value) => `"${value}"`)
        .join(',')}` + '\r\n';
    return st;
  }, str);
  var element = document.createElement('a');
  element.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvContent);
  element.target = '_blank';
  element.download = 'keyevent-details.csv';
  element.click();
}

function table_sort() {
	const styleSheet=document.createElement('style')
	styleSheet.innerHTML=`
        .order-inactive span {
            visibility:hidden;
        }
        .order-inactive:hover span {
            visibility:visible;
        }
        .order-active span {
            visibility: visible;
        }
    `
	document.head.appendChild(styleSheet)

	document.querySelectorAll('th.order').forEach(th_elem => {
		let asc=true
		const span_elem=document.createElement('span')
		span_elem.style="font-size:0.8rem; margin-left:0.5rem"
		span_elem.innerHTML="▼"
		th_elem.appendChild(span_elem)
		th_elem.classList.add('order-inactive')

		const index=Array.from(th_elem.parentNode.children).indexOf(th_elem)
		th_elem.addEventListener('click', (e) => {
			document.querySelectorAll('th.order').forEach(elem => {
				elem.classList.remove('order-active')
				elem.classList.add('order-inactive')
			})
			th_elem.classList.remove('order-inactive')
			th_elem.classList.add('order-active')

			if (!asc) {
				th_elem.querySelector('span').innerHTML='▲'
			} else {
				th_elem.querySelector('span').innerHTML='▼'
			}
			const arr=Array.from(th_elem.closest("table").querySelectorAll('tbody tr'))
			arr.sort((a, b) => {
				const a_val=a.children[index].innerText
				const b_val=b.children[index].innerText
				return (asc)? a_val.localeCompare(b_val):b_val.localeCompare(a_val)
			})
			arr.forEach(elem => {
				th_elem.closest("table").querySelector("tbody").appendChild(elem)
			})
			asc=!asc
		})
	})
}

table_sort()
