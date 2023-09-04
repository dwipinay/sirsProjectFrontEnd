import React, { useState, useEffect } from "react";
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { useNavigate, Link } from 'react-router-dom'
import style from './FormTambahRL37.module.css'
import { HiSaveAs } from 'react-icons/hi'
import { RiDeleteBin5Fill, RiEdit2Fill } from 'react-icons/ri'
import { AiFillFileAdd } from 'react-icons/ai'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
import Spinner from 'react-bootstrap/Spinner';

export const RL37 = () => {
  const [tahun, setTahun] = useState(new Date().getFullYear() - 1)
  const [namaRS, setNamaRS] = useState('')
  const [alamatRS, setAlamatRS] = useState('')
  const [namaPropinsi, setNamaPropinsi] = useState('')
  const [namaKabKota, setNamaKabKota] = useState('')
  
    const [token, setToken] = useState('')
    const [expire, setExpire] = useState('')
    const [dataRL, setDataRL] = useState([]);
    const [spinner, setSpinner]= useState(false)
    const navigate = useNavigate()
    

    useEffect(() => {
        refreshToken()
        // getDataRS()
        // getRL37();
        getCariTahun(new Date().getFullYear() - 1)

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
      const results = await axiosJWT.get('/apisirs/rltigatitiktujuh', customConfig);

      // console.log(results)

      const rlTigaTitikTujuhDetails = results.data.data.map((value) => {
        return value.rl_tiga_titik_tujuh_details;
      });

      let dataRLTigaTitikTujuhDetails = [];
      rlTigaTitikTujuhDetails.forEach((element) => {
        element.forEach((value) => {
          dataRLTigaTitikTujuhDetails.push(value);
        });
      });
      let sortedProducts = dataRLTigaTitikTujuhDetails.sort((p1, p2) =>
            p1.jenis_kegiatan_id > p2.jenis_kegiatan_id
          ? 1
          : p1.jenis_kegiatan_id < p2.jenis_kegiatan_id
          ? -1
          : 0
      );
console.log(sortedProducts)
let groups = [];
sortedProducts.reduce(function (res, value) {
  if (!res[value.jenis_kegiatan.group_jenis_kegiatan_id]) {
    res[value.jenis_kegiatan.group_jenis_kegiatan_id] = {
      groupId: value.jenis_kegiatan.group_jenis_kegiatan_id,
      groupNama:
        value.jenis_kegiatan.group_jenis_kegiatan_header.nama,
      groupNo:
        value.jenis_kegiatan.group_jenis_kegiatan_header.no,
      jumlah: 0,
    };
    groups.push(
      res[value.jenis_kegiatan.group_jenis_kegiatan_id]
    );
  }
  res[value.jenis_kegiatan.group_jenis_kegiatan_id].jumlah +=
    value.jumlah;
  return res;
}, {});

let data = [];
groups.forEach((element) => {
  if (element.groupId != null) {
    const filterData = sortedProducts.filter((value, index) => {
      return (
        value.jenis_kegiatan.group_jenis_kegiatan_id ===
        element.groupId
      );
    });
    data.push({
      groupNo: element.groupId,
      groupNama: element.groupNama,
      groupNomor : element.groupNo,
      details: filterData,
      subTotal: element.jumlah,
    });
  }
});
setDataRL(data);
setSpinner(false)
      // console.log(dataRLTigaTitikEnamDetails);
      // console.log(dataRL);
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
          const results = await axiosJWT.get('/apisirs/rltigatitiktujuh',
              customConfig)
          
          // console.log(results)

          const rlTigaTitikTujuhDetails = results.data.data.map((value) => {
              return value.rl_tiga_titik_tujuh_details
          })

          let dataRLTigaTitikTujuhDetails = []
          rlTigaTitikTujuhDetails.forEach(element => {
              element.forEach(value => {
                  dataRLTigaTitikTujuhDetails.push(value)
              })
          })
          let sortedProducts = dataRLTigaTitikTujuhDetails.sort((p1, p2) =>
            p1.jenis_kegiatan_id > p2.jenis_kegiatan_id
          ? 1
          : p1.jenis_kegiatan_id < p2.jenis_kegiatan_id
          ? -1
          : 0
      );

let groups = [];
      sortedProducts.reduce(function (res, value) {
        if (!res[value.jenis_kegiatan.group_jenis_kegiatan_id]) {
          res[value.jenis_kegiatan.group_jenis_kegiatan_id] = {
            groupId: value.jenis_kegiatan.group_jenis_kegiatan_id,
            groupNama:
              value.jenis_kegiatan.group_jenis_kegiatan_header.nama,
            groupNo:
              value.jenis_kegiatan.group_jenis_kegiatan_header.no,
            jumlah: 0,
          };
          groups.push(
            res[value.jenis_kegiatan.group_jenis_kegiatan_id]
          );
        }
        res[value.jenis_kegiatan.group_jenis_kegiatan_id].jumlah +=
          value.jumlah;
        return res;
      }, {});

      let data = [];
      groups.forEach((element) => {
        if (element.groupId != null) {
          const filterData = sortedProducts.filter((value, index) => {
            return (
              value.jenis_kegiatan.group_jenis_kegiatan_id ===
              element.groupId
            );
          });
          data.push({
            groupNo: element.groupId,
            groupNama: element.groupNama,
            groupNomor: element.groupNo,
            details: filterData,
            subTotal: element.jumlah,
          });
        }
      });
      setDataRL(data);
      setSpinner(false)
    } catch (error) {
      toast("Get Data Error", {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log(error);
    }
  }
    
  
  const deleteUser = async (id,tahun) => {
  
    try {
        const customConfig = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
         await axiosJWT.delete("/apisirs/rltigatitiktujuhdetail/" + id,
            customConfig)
        
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
                const results = await axiosJWT.get('/apisirs/rltigatitiktujuh',
                    customConfig)
                
                // console.log(results)
      
                const rlTigaTitikTujuhDetails = results.data.data.map((value) => {
                    return value.rl_tiga_titik_tujuh_details
                })
      
                let dataRLTigaTitikTujuhDetails = []
                rlTigaTitikTujuhDetails.forEach(element => {
                    element.forEach(value => {
                        dataRLTigaTitikTujuhDetails.push(value)
                    })
                })
                let sortedProducts = dataRLTigaTitikTujuhDetails.sort((p1, p2) =>
                  p1.jenis_kegiatan_id > p2.jenis_kegiatan_id
                ? 1
                : p1.jenis_kegiatan_id < p2.jenis_kegiatan_id
                ? -1
                : 0
            );
      
      let groups = [];
            sortedProducts.reduce(function (res, value) {
              if (!res[value.jenis_kegiatan.group_jenis_kegiatan_id]) {
                res[value.jenis_kegiatan.group_jenis_kegiatan_id] = {
                  groupId: value.jenis_kegiatan.group_jenis_kegiatan_id,
                  groupNama:
                    value.jenis_kegiatan.group_jenis_kegiatan_header.nama,
                  groupNo:
                    value.jenis_kegiatan.group_jenis_kegiatan_header.no,
                  jumlah: 0,
                };
                groups.push(
                  res[value.jenis_kegiatan.group_jenis_kegiatan_id]
                );
              }
              res[value.jenis_kegiatan.group_jenis_kegiatan_id].jumlah +=
                value.jumlah;
              return res;
            }, {});
      
            let data = [];
            groups.forEach((element) => {
              if (element.groupId != null) {
                const filterData = sortedProducts.filter((value, index) => {
                  return (
                    value.jenis_kegiatan.group_jenis_kegiatan_id ===
                    element.groupId
                  );
                });
                data.push({
                  groupNo: element.groupId,
                  groupNama: element.groupNama,
                  groupNomor:element.groupNo,
                  details: filterData,
                  subTotal: element.jumlah,
                });
              }
            });
            setDataRL(data);
            console.log(data)
            console.log(setDataRL)
          } catch (error) {
            toast("Get Data Error", {
              position: toast.POSITION.TOP_RIGHT,
            });
            console.log(error);
          }
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
                        deleteUser(id, tahun)
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
                                  placeholder="Tahun" value={tahun} onChange={e => changeHandlerSingle(e)}/>
                              <label htmlFor="floatingInput" >Tahun</label>
                          </div>
                          <div className="mt-3 mb-3">
                              <button type="submit" className="btn btn-outline-success"><HiSaveAs/> Cari</button>
                          </div>
                      </form>
                  </div>
              </div>
          </div>
      </div>
      
        <Link to={`/rl37/tambah/`} className='btn btn-info' style={{fontSize:"18px", backgroundColor: "#779D9E", color: "#FFFFFF"}}>
            {/* <AiFillFileAdd size={30} style={{color:"gray",cursor: "pointer"}}/><span style={{color: "gray"}}></span> */}
            +
            </Link>
            <span style={{color: "gray"}}>RL 3.7 Radiologi</span>
                  
        <div className="row mt-3 mb-3">
            <div className="col-md-12">
              <div className="container" style={{ textAlign: "center" }}>
                  {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                  {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                  {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                  {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                  {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                  {spinner && <Spinner animation="grow" variant="success"></Spinner>}
            </div>
                <table className={style.rlTable}>
                  
                    <thead>
                        <tr>
                        <th style={{"width": "6%"}}>No</th>
                            <th style={{"width": "10%"}}> </th>
                            {/* <th style={{"width": "7%"}}>No Kegiatan</th> */}
                            <th>Jenis Kegiatan</th>
                            <th>Jumlah</th>
                        </tr>
                    </thead>
                   
                    <tbody>
                    
              {
                // eslint-disable-next-line
                dataRL.map((value, index) => {
                  if (value.groupNama != null) {
                    return (
                      <React.Fragment key={index}>
                        <tr>
                          <td>{value.groupNomor}</td>
                          <td></td>
                          <td style={{ textAlign: "left" }}>
                            {value.groupNama}
                          </td>
                          <td>{value.subTotal}</td>
                        </tr>
                        {value.details.map((value2, index2) => {
                          return (
                            <tr key={index2}>
                              <td>{value2.jenis_kegiatan.no}</td>
                              <td>
                                <ToastContainer />
                                {/* <RiDeleteBin5Fill
                                  size={20}
                                  onClick={(e) =>
                                    hapus(value2.id, value2.tahun)
                                  }
                                  style={{
                                    color: "gray",
                                    cursor: "pointer",
                                    marginRight: "5px",
                                  }}
                                /> */}
                                <button className="btn btn-danger" style={{margin: "0 5px 0 0", backgroundColor: "#FF6663", border: "1px solid #FF6663"}} type='button' onClick={(e) => hapus(value2.id, value2.tahun)}>H</button>
                                {/* <Link to={`/rl37/ubah/${value2.id}`}>
                                  <RiEdit2Fill
                                    size={20}
                                    style={{ color: "gray", cursor: "pointer" }}
                                  />
                                </Link> */}
                                <Link to={`/rl37/ubah/${value2.id}`} className='btn btn-warning' style={{margin: "0 5px 0 0", backgroundColor: "#CFD35E", border: "1px solid #CFD35E", color:"#FFFFFF"}} >
                                                        U
                                                    </Link>
                              </td>
                              <td style={{ textAlign: "left" }}>
                                &emsp;{value2.jenis_kegiatan.nama}
                              </td>
                              <td>{value2.jumlah}</td>
                            </tr>
                          );
                        })}
                      </React.Fragment>
                    );
                  } else if (value.groupNama == null) {
                    return (
                      <React.Fragment key={index}>
                        <tr>
                          <td style={{ textAlign: "left" }}>
                            {value.details[0].nama}
                          </td>
                          <td>{value.details[0].nilai}</td>
                        </tr>
                      </React.Fragment>
                    );
                  }
                })
              }
            </tbody>
                </table>
            </div>
        </div>
    </div>
  )
}

export default RL37