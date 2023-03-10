/** Funciones Administrativas  */

function quitaAdmin(botonQuitar) {
    let fila = botonQuitar.parentNode.parentNode;
    if (fila.hasChildNodes()) 
    {
      let columns = fila.querySelectorAll("td");
      if (columns.length > 0) {
        let idProducto = parseInt(columns[0].innerText) || -1;
        if (idProducto > -1) {
          stock.quitaArticulo(idProducto);
          guardarStock();
        }
      }
      botonQuitar.removeEventListener('click', function() {quitaAdmin(this)}); 
      fila.remove();
    }
  }
  
  function nuevoProd() {
    const inputId = document.querySelector("#idInput");
    inputId.value = nuevoIDProducto();
  }

  function editaAdmin(botonEditar) {
    let fila = botonEditar.parentNode.parentNode;
    if (fila.hasChildNodes()) 
    {
      let columns = fila.querySelectorAll("td");
      if (columns.length > 0) {
        let idProducto = parseInt(columns[0].innerText) || -1;
        if (idProducto > -1) {
          let productoEditar = stock.getArticulo(idProducto);
          const inputId = document.querySelector("#idInput");
          const inputNombre = document.querySelector("#nombreInput");
          const inputDesc = document.querySelector("#descInput");
          const inputCat = document.querySelector("#catInput");
          const inputPrec = document.querySelector("#preInput");
          const inputStock = document.querySelector("#stockInput");
          const inputRuta = document.querySelector("#rutaInput");
  
          inputId.value = productoEditar.id;
          inputNombre.value = productoEditar.nombre;
          inputDesc.value = productoEditar.descripcion;
          inputCat.value = productoEditar.categoria;
          inputPrec.value = productoEditar.precio;
          inputStock.value = productoEditar.cantidad;
          inputRuta.value = productoEditar.ruta;
  
        }
      }
    }
  }
  function confirmarCargaAdmin() {
    const inputId = document.querySelector("#idInput");
    const inputNombre = document.querySelector("#nombreInput");
    const inputDesc = document.querySelector("#descInput");
    const inputCat = document.querySelector("#catInput");
    const inputPrec = document.querySelector("#preInput");
    const inputStock = document.querySelector("#stockInput");
    const inputRuta = document.querySelector("#rutaInput");

    const idProducto = parseInt(inputId.value) || -1;
    const cantiStock = parseInt(inputStock.value) || -1 ;
    if (idProducto > -1 && cantiStock > -1 && inputNombre.value != '') {
      let productoConfirmado = stock.getArticulo(idProducto);
      if (typeof productoConfirmado != 'undefined') {
        productoConfirmado.nombre = inputNombre.value;
        productoConfirmado.descripcion = inputDesc.value;
        productoConfirmado.categoria = inputCat.value;
        productoConfirmado.precio = inputPrec.value;
        productoConfirmado.cantidad = cantiStock;
        productoConfirmado.ruta = inputRuta.value;
      } else {
        productoConfirmado = new Producto(idProducto, inputNombre.value, inputPrec.value, cantiStock, inputDesc.value, inputCat.value, inputRuta.value);
        stock.articulos.push(productoConfirmado);
      }
      guardarStock();
      renderAdminPaginado();
      muestraMensaje("Se realizo la carga de datos con exito.")
    } else {
      muestraMensaje("Hay campos vacios, revise por favor.")
    }
    


  }
  function previousAdminPage() {
    if(curAdminPage > 1) curAdminPage--;
    renderAdminPaginado();
  }
  
  function nextAdminPage() {
    if((curAdminPage * adminPageSize) < stock.articulos.length) curAdminPage++;
    renderAdminPaginado();
  }
  
  function renderAdminPaginado() {
    const bodyTablaAdmin = document.querySelector("#bodyTablaAdmin");
  
    bodyTablaAdmin.replaceChildren();
    const artsStock = stock.articulos.filter((row, index) => {
      let start = (curAdminPage-1)*adminPageSize;
      let end =curAdminPage*adminPageSize;
      if(index >= start && index < end) return true;
    });
  
    artsStock.forEach(element => {
        const tr = document.createElement("tr");
        const tdID = document.createElement("td");
        const tdNombre = document.createElement("td");
        const tdPrecio = document.createElement("td");
        const tdCant = document.createElement("td");
        const tdDesc = document.createElement("td");
        const tdCategoria = document.createElement("td");
        const tdRuta = document.createElement("td");
  
        tdID.innerText = element.id;
        tdNombre.innerText = element.nombre;
        tdPrecio.innerText = element.precio;
        tdCant.innerText = element.cantidad;
        tdDesc.innerText = element.descripcion;
        tdCategoria.innerText = element.categoria;
        tdRuta.innerText = element.ruta;
  
        const tdOpciones = document.createElement("td");
        const btnEditaElem = document.createElement("button");
        const btnquitaElem = document.createElement("button");

        btnEditaElem.className = "btn btn--azul";
        btnEditaElem.innerText = "Editar";
        btnEditaElem.addEventListener('click', function() {editaAdmin(this)});
        btnquitaElem.className = "btn btn--azul";
        btnquitaElem.innerText = "Quitar";
        btnquitaElem.addEventListener('click', function() {quitaAdmin(this)});
        tdOpciones.append(btnEditaElem, btnquitaElem);
        
        tr.append(tdID, tdNombre, tdDesc, tdCategoria, tdPrecio, tdCant, tdRuta, tdOpciones);
  
        bodyTablaAdmin.append(tr);
  
    });
  }
  
  function ordenaAdmin(e) {
    let thisSort = e.target.dataset.sort;
    if(adminSortCol === thisSort) adminSortAsc = !adminSortAsc;
    adminSortCol = thisSort;
    stock.getArticulos().sort((a, b) => {
      if(a[adminSortCol] < b[adminSortCol]) return adminSortAsc?1:-1;
      if(a[adminSortCol] > b[adminSortCol]) return adminSortAsc?-1:1;
      return 0;
    });
    renderAdminPaginado();
  }