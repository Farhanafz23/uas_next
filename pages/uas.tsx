import { useState,useEffect } from "react";
import axios from "axios";
import { stat } from "fs";

 
 const koneksiUas = axios.create({
  
  baseURL: "http://127.0.0.1:5000/api/uas" 
});

export default function FormUas() {
    const [statenama, setNama] = useState("");
    const [statenik, setNik] = useState("");
    const [statetanggal, setTanggal] = useState("2018-07-22");
    const [statealamat, setAlamat] = useState("");
    const [stateagama, setAgama] = useState("");
    const [statefoto, setFoto] = useState("");
    const [uas, setUas] =  useState(null);
    const [stateadd,setAdd]=useState("hide");
    const [statebutonadd,setbtnAdd]=useState("show");
    const [stateedit,setEdit]=useState("hide");
    
    function formatDate(date) {
      var d = new Date(date),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();
  
      if (month.length < 2) 
          month = '0' + month;
      if (day.length < 2) 
          day = '0' + day;
  
      return [year, month, day].join('-');
  }
  
  const handleSubmitAdd = (event) => {
    
    event.preventDefault();
    const formData = new FormData(event.target);
    koneksiUas
      .post("/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
     
 }
 const handleSubmitEdit =  (event) => {
    
  event.preventDefault();
  const address = "/"+event.target.nik.value;
  alert(address);
  //const formData = new FormData(event.target);
  const formData = {
    nik: event.target.nik.value,
    nama: event.target.nama.value,
    tanggal_lahir: event.target.tanggal_lahir.value,
    alamat: event.target.alamat.value,
    agama: event.target.agama.value
}
  alert(formData);
  koneksiUas
    .put( address,formData)
    .then((res) => {
      console.log(res);
      window.location.reload();
    })
    .catch((err) => {
      console.log(err);
    });
   
}
  const handleAdd = (event) => {
    
     setAdd("show");
     setbtnAdd("hide");
     setEdit("hide");
 
      
  }
  const handleCancelAdd = (event) => {
    
     setAdd("hide");
     setbtnAdd("show");
     setEdit("hide");
 
      
  }
  const handleCancelEdit = (event) => {
    
    setAdd("hide");
    setbtnAdd("show");
    setEdit("hide");
    setNama("");
    setNik("");
    setTanggal(formatDate("2018-07-22"));
    setAlamat("");
    setAgama("");
    setFoto("");
     
 }
   const handleDelete = (event) => {
            event.preventDefault();
            var nik = event.target.value;
            koneksiUas.delete(`/${nik}`)
              .then(response => {
                console.log('Data berhasil dihapus:', response.data);
                window.location.reload();
                setUas(
                  uas.filter((uas) => {
                     return uas.nik !== nik;
                  }))
             
                // Lakukan langkah-langkah lain setelah penghapusan data
              })
              .catch(error => {
                console.error('Gagal menghapus data:', error);
              })
          }

      const handleEdit = (event) => {
            event.preventDefault();
            var nik = event.target.value;
            
               const ujianEdit = uas.filter((uas) => {
                     return uas.nik == nik;
                  });
                  if(ujianEdit!=null){
                    setNik(ujianEdit[0].nik);
                    setNama(ujianEdit[0].nama);
                    setTanggal(formatDate(ujianEdit[0].tanggal_lahir));
                    setAlamat(ujianEdit[0].alamat);
                    setAgama(ujianEdit[0].agama);
                    setFoto(ujianEdit[0].foto);
                    setAdd("hide");
                    setbtnAdd("hide");
                    setEdit("show");

                  }
          }
  useEffect(() => {
      async function getUas() {
        const response = await koneksiUas.get("/").then(function (axiosResponse) {
            setUas(axiosResponse.data.data); 
     
         })
         .catch(function (error) {   
          alert('error from uas in api uas: '+error);
         });;
          }
      getUas();
    }, []);
  
   
if(uas==null){
return(
  <div>
    waiting...
  </div>
)
}else{

  return (
   <center><div>
    <br></br><h1>DATA PENDAFTARAN</h1><br></br>
       <form id="formadd" className={stateadd} onSubmit={handleSubmitAdd} >
       <br/><h3>TAMBAH DATA PENDAFTARAN</h3><br/>
        <table border={0}>
            <tbody>
            <tr>
            <td> <label> Nik:</label></td>
            <td><input type="text" id="nik" name="nik"/>
              
              </td>
        </tr>
        <tr>
            <td>  <label> Nama:</label></td>
            <td><input type="text" id="nama"   name="nama" 
               /></td>
        </tr>
        <tr>
            <td>  <label> Tanggal Lahir:</label></td>
            <td>  <input type="date" name="tanggal_lahir"
           min="1970-01-01" max="2025-12-31"/>
     </td>
        </tr>
        <tr>
            <td>  <label> Alamat:</label></td>
            <td><textarea  id="address" style={{resize: "none"}}  name="alamat" ></textarea></td>
        </tr>
        <tr>
            <td>  <label> Agama:</label></td>
            <td><input type="text" id="agama"   name="agama" 
               /></td>
        </tr>
        <tr>
            <td>  <label> Foto:</label></td>
            <td>   <input
                    type="file" name="image"/>  </td>
        </tr>
            </tbody>
          </table>
          <br/>
          <input type="submit"/> | <input type="button" value="Cancel" onClick={handleCancelAdd} /><br/><br/>
          </form>  

      <form id="formedit" className={stateedit} onSubmit={handleSubmitEdit}>
      <br/><h3>EDIT DATA PENDAFTARAN</h3><br/>
          <table border={0}>
            <tbody>
            <tr>
            <td> <label> Nik:</label></td>
            <td><input type="text" id="nik"  value={statenik} name="nik"/>
              {/* onChange={handleOnchangeNim}  /> */}
              </td>
        </tr>
        <tr>
            <td>  <label> Nama:</label></td>
            <td><input type="text" id="nama"  value={statenama} name="nama"
               onChange={(e) => setNama(e.target.value)}
               /></td>
        </tr>
        <tr>
            <td>  <label> Tanggal Lahir:</label></td>
            <td>  <input type="date" value={statetanggal} name="tanggal_lahir"  onChange={(e) => setTanggal(e.target.value)}
           min="1970-01-01" max="2025-12-31"/>
     </td>
        </tr>
        <tr>
            <td>  <label> Alamat:</label></td>
            <td><textarea  id="address" style={{resize: "none"}} value={statealamat} name="alamat"  onChange={(e) => setAlamat(e.target.value)}></textarea></td>
        </tr>
        <tr>
            <td>  <label> Agama:</label></td>
            <td><input type="text" id="agama"  value={stateagama} name="agama"
               onChange={(e) => setAgama(e.target.value)}
               /></td>
        </tr>
        <tr>
            <td>  <label> Foto:</label></td>
            <td>  <img src={statefoto} width="80"/> </td>
        </tr>
            </tbody>
          </table>
          <br/><input type="submit" /> | <input type="button" value="Cancel" onClick={handleCancelEdit} /><br/><br/>
          </form>  
          <br></br>
        <button id="btnadd" onClick={handleAdd} className={statebutonadd} style={{backgroundColor: "rgb(56, 134, 79)",color:"white", borderWidth: "0.5px", padding: "5px", borderSpacing: "0", borderRadius: "3px"}}>
          Tambah Data</button>
        <br></br><br></br>
            Tabel Pendaftaran hasil get Local Nodejs 
        <table border={2}>
            <thead>
                <tr style={{textAlign:"center"}}>
                <td>Nik</td> 
                <td>Nama</td>
                <td>Tanggal Lahir</td>
                <td>Alamat</td>
                <td>Agama</td>
                <td>Foto</td>
                <td colSpan={2}><center>Action</center></td>
                </tr>
            </thead>
            <tbody>
            {uas.map((ujian) => 
                <tr style={{textAlign:"center"}}>
                    <td>{ujian.nik}</td>
                    <td>{ujian.nama}</td>
                    <td>{ujian.tanggal_lahir}</td>
                    <td>{ujian.alamat}</td>
                    <td>{ujian.agama}</td>
                    <td><img src={ujian.foto} width="80"/></td>
                   <td><button className="ngedit" onClick={handleEdit} value={ujian.nik}>Edit</button> | <button className="ngehapus" onClick={handleDelete} value={ujian.nik}> Delete</button></td>
                </tr>
           )}     
                   </tbody>
          </table>
          <br></br>
          <br></br><br></br>
         
          </div></center>
        )
}
  
  }