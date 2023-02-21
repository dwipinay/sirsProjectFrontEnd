import React, { useState, useEffect } from "react";
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { useNavigate, Link } from 'react-router-dom'
import style from './FormTambahRL313A.module.css'
import { HiSaveAs } from 'react-icons/hi'
import { RiDeleteBin5Fill, RiEdit2Fill } from 'react-icons/ri'
import { AiFillFileAdd } from 'react-icons/ai'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
import Table from 'react-bootstrap/Table';
import Spinner from "react-bootstrap/esm/Spinner";

export const RL313A = () => {
  const [tahun, setTahun] = useState('2022')
  const [namaRS, setNamaRS] = useState('')
  const [alamatRS, setAlamatRS] = useState('')
  const [namaPropinsi, setNamaPropinsi] = useState('')
  const [namaKabKota, setNamaKabKota] = useState('')
    // const [nama, setNama] = useState('')
    const [token, setToken] = useState('')
    const [expire, setExpire] = useState('')
    const [dataRL, setDataRL] = useState([]);
    const [spinner, setSpinner]= useState(false)
    const navigate = useNavigate()
    

    useEffect(() => {
        refreshToken()
        getCariTahun(2022)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const refreshToken = async() => {
      try {
        const response = await axios.get('/apisirs/token')
        setToken(response.data.accessToken)
        const decoded = jwt_decode(response.data.accessToken)
        setExpire(decoded.exp)
        getDataRS(decoded.rsId)
    } catch (error) {
        if(error.response) {
            navigate('/')
        }
    }
}

const axiosJWT = axios.create()
axiosJWT.interceptors.request.use(async(config) => {
    const currentDate = new Date()
    if (expire * 1000 < currentDate.getTime()) {
        const response = await axios.get('/apisirs/token')
        config.headers.Authorization = `Bearer ${response.data.accessToken}`
        setToken(response.data.accessToken)
        const decoded = jwt_decode(response.data.accessToken)
        setExpire(decoded.exp)
    }
    return config
}, (error) => {
    return Promise.reject(error)
})
  
const getDataRS = async (id) => {
  try {
      const response = await axiosJWT.get('/apisirs/rumahsakit/' + id, {
          headers: {
              Authorization: `Bearer ${token}`
          }
      })
      console.log(response.data)
      setNamaRS(response.data.data[0].nama)
      setAlamatRS(response.data.data[0].alamat)
      setNamaPropinsi(response.data.data[0].propinsi.nama)
      setNamaKabKota(response.data.data[0].kabKota.nama)
  } catch (error) {
      
  }
}
  
  const changeHandlerSingle = (event) => {
    setTahun(event.target.value)
}

  const getCariTahun = async (tahun) => {
    setSpinner(true)
    try {
      const customConfig = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: {
          tahun: tahun,
        },
      };
      const results = await axiosJWT.get("/apisirs/rltigatitiktigabelasa", customConfig);

      // console.log(results)

      const rlTigaTitikTigaBelasADetails = results.data.data.map((value) => {
        return value.rl_tiga_titik_tiga_belas_a_details;
      });

      let dataRLTigaTitikTigaBelasADetails = [];
      rlTigaTitikTigaBelasADetails.forEach((element) => {
        element.forEach((value) => {
          dataRLTigaTitikTigaBelasADetails.push(value);
        });
      });

      setDataRL(dataRLTigaTitikTigaBelasADetails);
      setSpinner(false)
    } catch (error) {
      console.log(error);
    }
  };

  const Cari = async (e) => {
      e.preventDefault()
      setSpinner(true)
      try {
          const customConfig = {
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              },
              params: {
                  tahun: tahun
              }
          }
          const results = await axiosJWT.get('/apisirs/rltigatitiktigabelasa',
              customConfig)

          const rlTigaTitikTigaBelasADetails = results.data.data.map((value) => {
              return value.rl_tiga_titik_tiga_belas_a_details
          })

          let dataRLTigaTitikTigaBelasADetails = []
          rlTigaTitikTigaBelasADetails.forEach(element => {
              element.forEach(value => {
                dataRLTigaTitikTigaBelasADetails.push(value)
              })
          })

          setDataRL(dataRLTigaTitikTigaBelasADetails)
          setSpinner(false)
      } catch (error) {
          console.log(error)
      }
  }
    const deleteUser = async (id) => {
  
    const customConfig = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }
    try {
        await axiosJWT.delete(`/apisirs/rltigatitiktigabelasadetail/${id}`,
            customConfig)
        setDataRL((current) =>
            current.filter((value) => value.id !== id)
        )
        toast('Data Berhasil Dihapus', {
            position: toast.POSITION.TOP_RIGHT
        })
    } catch (error) {
        console.log(error)
        toast('Data Gagal Dihapus', {
            position: toast.POSITION.TOP_RIGHT
        })
    }
}
    
    const hapus = (id) => {
        confirmAlert({
            title: 'Konfirmasi Penghapusan',
            message: 'Apakah Anda Yakin?',
            buttons: [
                {
                    label: 'Ya',
                    onClick: () => {
                        deleteUser(id)
                    }
                },
                {
                    label: 'Tidak'
                }
            ]
        })
    }


    return (
        <div className="container" style={{marginTop: "70px"}}>
        <div className="row">
            <div className="col-md-6">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title h5">Profile Fasyankes</h5>
                        <div className="form-floating" style={{width:"100%", display:"inline-block"}}>
                            <input type="text" className="form-control" id="floatingInput"
                                value={ namaRS } disabled={true}/>
                            <label htmlFor="floatingInput">Nama</label>
                        </div>
                        <div className="form-floating" style={{width:"100%", display:"inline-block"}}>
                            <input type="text" className="form-control" id="floatingInput"
                                value={ alamatRS} disabled={true}/>
                            <label htmlFor="floatingInput">Alamat</label>
                        </div>
                        <div className="form-floating" style={{width:"50%", display:"inline-block"}}>
                            <input type="text" className="form-control" id="floatingInput"
                                value={ namaPropinsi } disabled={true}/>
                            <label htmlFor="floatingInput">Provinsi </label>
                        </div>
                        <div className="form-floating" style={{width:"50%", display:"inline-block"}}>
                            <input type="text" className="form-control" id="floatingInput"
                                value= { namaKabKota } disabled={true}/>
                            <label htmlFor="floatingInput">Kab/Kota</label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-6">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title h5">Periode Laporan</h5>
                        <form onSubmit={Cari}>
                            <div className="form-floating" style={{width:"100%", display:"inline-block"}}>
                                <input name="tahun" type="text" className="form-control" id="floatingInput" 
                                    placeholder="Tahun" value={tahun} onChange={e => changeHandlerSingle(e)} />
                                <label htmlFor="floatingInput">Tahun</label>
                            </div>
                            <div className="mt-3 mb-3">
                                <button type="submit" className="btn btn-outline-success"><HiSaveAs/> Cari</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
            <div className="row mt-3 mb-3">
                <div className="col-md-12">
                    <Link to={`/rl313a/tambah/`} style={{textDecoration: "none"}}>
                        <AiFillFileAdd size={30} style={{color:"gray",cursor: "pointer"}}/><span style={{color: "gray"}}></span>
                        <span style={{color: "gray"}}>RL 3.13 Obat Pengadaan</span>
                    </Link>
                    <div className="container" style={{ textAlign: "center" }}>
                        {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                        {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                        {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                        {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                        {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                        {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                    </div>
                    <Table className={style.rlTable}>
                        <thead>
                            <tr>
                                <th style={{"width": "7%"}}>No Golongan Obat</th>
                                <th style={{"width": "7%"}}> </th> 
                                <th>Golongan Obat</th>
                                <th>JUMLAH ITEM OBAT</th>
                                <th>JUMLAH ITEM OBAT YANG TERSEDIA DI RUMAH SAKIT</th>
                                <th>JUMLAH ITEM OBAT FORMULATORIUM TERSEDIA DIRUMAH SAKIT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataRL.map((value, index) => {
                                return (
                                <tr key={value.id}>
                                    <td><center>{value.golongan_obat.no}</center>
                                    </td>
                                    <td style={{textAlign: "center", verticalAlign: "middle"}}>
                                        <ToastContainer />
                                        <RiDeleteBin5Fill  size={20} onClick={(e) => hapus(value.id)} style={{color: "gray", cursor: "pointer", marginRight: "5px"}} />
                                        <Link to={`/rl313a/ubah/${value.id}`}>
                                            <RiEdit2Fill size={20} style={{color:"gray",cursor: "pointer"}}/>
                                        </Link>
                                    </td>
                                    <td>{value.golongan_obat.nama}
                                    </td>
                                    <td><center>{value.jumlah_item_obat}</center>
                                    </td>
                                    <td><center>{value.jumlah_item_obat_rs}</center>
                                    </td>
                                    <td><center>{value.jumlah_item_obat_formulatorium} </center>
                                    </td>
                                </tr>
                                )
                            }) }
                        </tbody>
                    </Table>
                </div>
            </div>
        </div>
    )
}

export default RL313A