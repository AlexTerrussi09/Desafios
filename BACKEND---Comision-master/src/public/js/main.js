const socketClient = io();

let addProduct = document.getElementById("formulario");
let listProduct = document.getElementById("list");

const formInput = [...document.getElementsByClassName("form")];

addProduct.addEventListener("submit", (e) =>{
    e.preventDefault()
    console.log(e.target)
    const prodsIterator = new FormData(e.target) //Transforma un objeto HTML en un objeto iterator
    const prod = Object.fromEntries(prodsIterator) //Transforma de un objeto iterator a un objeto simple
    console.log("prod:", prod)


    const typeMethod = {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(prod),
      };
    
      fetch("/product", typeMethod)
        .then((response) => {
          if (response.ok) console.log(response);
          else throw new Error(response.status);
        })
        .catch((err) => {
          console.error("ERROR: ", err.message);
        });
    
        socketClient.emit("prod", { ...prod});
        socketClient.on("productoFromForm", (productsListArray) => {
            let listToRender = "";
    
            productsListArray.forEach(product => {
                listToRender += `-Producto: "${product?.title}" está en tu lista</br>
                </br> `
            });
    
            listProduct.innerHTML = listToRender
        })
})


let formDeleteProducts = document.getElementById("deleteForm");
let inputDeleteByIdProduct = document.getElementById("pID");

formDeleteProducts.addEventListener("submit",(e)=>{
  e.preventDefault()

  let deleteProdutc = inputDeleteByIdProduct.value
  let direc = "/product/" + deleteProdutc

  const typeMethod = {
    method : "DELETE",
    headers:{'Content-type': 'application/json; charset=UTF-8',}
  }

  fetch(direc, typeMethod)
    .then(response =>{
      if(response.ok){
        console.log(response)
      } else{
        throw new Error(response.status);
      }
    })
    .then(socketClient.emit("prodDelete",{id: deleteProdutc}))
    .catch(error =>{
        console.log(error)
    })
    
    
    socketClient.on("prodDeletelist", (obj)=>{
      let listNew = ""

      obj.forEach(pDelete =>{
        listNew += `
        -Producto: "${pDelete.title}" está en tu lista </br>
        </br>`
      })

      listProduct.innerHTML = listNew

    })
})