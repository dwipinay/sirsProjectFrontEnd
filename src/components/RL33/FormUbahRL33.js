import React, { useState, useEffect } from "react"
import axios from "axios"
import jwt_decode from 'jwt-decode'
import { useNavigate, useParams } from "react-router-dom"
import style from './FormTambahRL33.module.css'
import { HiSaveAs } from 'react-icons/hi'
import { IoArrowBack } from 'react-icons/io5'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom'

export const FormUbahRL33 = () => {
    const [tahun, setTahun] = useState('')
    const [namaRS, setNamaRS] = useState('')
    const [alamatRS, setAlamatRS] = useState('')
    const [namaPropinsi, setNamaPropinsi] = useState('')
    const [namaKabKota, setNamaKabKota] = useState('')
    const [jenisKegiatan, setJeniskegiatan] = useState('')
    const [jumlah, setJumlah] = useState('')
    const [no, setNo] = useState('')
    const [nama, setNama] = useState('')
    const [dataRL, setDataRL] = useState([])
    const [token, setToken] = useState('')
    const [expire, setExpire] = useState('')
    const navigate = useNavigate()
    const { id } = useParams();
    
    useEffect(() => {
        refreshToken()
        getRLTigaTitikTigaById();
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
            const response = await axios.get('apisirs/token')
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
            //console.log(response.data)
            setNamaRS(response.data.data[0].nama)
            setAlamatRS(response.data.data[0].alamat)
            setNamaPropinsi(response.data.data[0].propinsi.nama)
            setNamaKabKota(response.data.data[0].kabKota.nama)
        } catch (error) {
            console.log(error)
        }
    }

    const changeHandlerSingle = (event) => {
        setTahun(event.target.value)
    }

    const changeHandler = (event, index) => {
        let newDataRL = [...dataRL]
        const name = event.target.name
        if (name === 'check') {
            if (event.target.checked === true) {
                newDataRL[index].disabledInput = false
            } else if (event.target.checked === false) {
                newDataRL[index].disabledInput = true
            }
            newDataRL[index].checked = event.target.checked
        } else if (name === 'no') {
            if (event.target.value === '') {
                event.target.value = 0
                event.target.select(event.target.value)
              }
            newDataRL[index].no = event.target.value
        } else if (name === 'jenisKegiatan') {
            if (event.target.value === '') {
                event.target.value = 0
                event.target.select(event.target.value)
              }
            newDataRL[index].jenisKegiatan = event.target.value
        } else if (name === 'jumlah') {
            if (event.target.value === '') {
                event.target.value = 0
                event.target.select(event.target.value)
              }
            newDataRL[index].jumlah = event.target.value
        } 
        setDataRL(newDataRL)
    }

    const updateDataRLTigaTitikTiga = async (e) => {
        e.preventDefault();
        try {
            const customConfig = {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    }
            const result = await axiosJWT.patch('/apisirs/rltigatitiktigadetail/' + id, {
                no,
                nama,
                jumlah,
            }, customConfig);
            toast('Data Berhasil Diupdate', {
                position: toast.POSITION.TOP_RIGHT
            })
            setTimeout(() => {
                navigate('/rl33')
            }, 1000);
        } catch (error) {
            console.log(error)
            toast('Data Gagal Diupdate', {
                position: toast.POSITION.TOP_RIGHT
            })
        } 
    };
    
    const getRLTigaTitikTigaById = async () => {
        // const response = await axios.get(`http://localhost:5001/rltigatitiktigadetail/${id}`);
        const response = await axiosJWT.get('/apisirs/rltigatitiktigadetail/'+ id, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        setNama(response.data.data.jenis_kegiatan.nama);
        setNo(response.data.data.jenis_kegiatan.no);
        setJeniskegiatan(response.data.data.rl_tiga_titik_tiga_id);
        setJumlah(response.data.data.jumlah);
        // console.log(response.data.data.jenis_kegiatan.no);
        
    };

    const preventPasteNegative= (e) => {
        const clipboardData = e.clipboardData || window.clipboardData;
        const pastedData = parseFloat(clipboardData.getData('text'));

        if(pastedData <0){
            e.preventDefault();
        }
    }

    const preventMinus = (e) => {
        if(e.code === 'Minus'){
            e.preventDefault();
        }
    }

    const maxLengthCheck = (object) => {
        if (object.target.value.length > object.target.maxLength) {
          object.target.value = object.target.value.slice(0, object.target.maxLength)
        }
      }

  return (
    <div className="container" style={{marginTop: "70px"}}>
    <form onSubmit={updateDataRLTigaTitikTiga}>
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
                                value={ namaKabKota } disabled={true}/>
                            <label htmlFor="floatingInput">Kab/Kota</label>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className="col-md-6">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title h5">Periode Laporan</h5>
                        <div className="form-floating" style={{width:"100%", display:"inline-block"}}>
                            <input name="tahun" type="text" className="form-control" id="floatingInput" 
                                placeholder="Tahun" value={tahun} onChange={e => changeHandlerSingle(e)}/>
                            <label htmlFor="floatingInput">Tahun</label>
                        </div>
                    </div>
                </div>
            </div> */}
        </div>
        <br></br>
        <div className="row mt-3">
            <div className="col-md-12">
            {/* <Link to={`/rl33/`} style={{textDecoration: "none"}}>
                <IoArrowBack size={30} style={{color:"gray",cursor: "pointer"}}/><span style={{color: "gray"}}>RL 3.3 Gigi Mulut</span>
            </Link> */}
            <Link to={`/rl33/`} className='btn btn-info' style={{fontSize:"18px", backgroundColor: "#779D9E", color: "#FFFFFF"}}>
                {/* <IoArrowBack size={30} style={{color:"gray",cursor: "pointer"}}/> */}
                &lt;
            </Link>
            <span style={{color: "gray"}}>Kembali RL 3.3 Gigi Mulut</span>
            <br></br>
                <table className={style.rlTable}>
                    <thead>
                        <tr>
                        {/* <th style={{"width": "6%"}}>No.</th> */}
                            <th style={{"width": "5%"}}>No Kegiatan</th>
                            <th>Jenis Kegiatan</th>
                            <th style={{"width": "40%"}}>Jumlah</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* <td>
                            <input name="no" type="text" className="form-control" id="floatingInput" placeholder="no" value={no} onChange={e => changeHandler(e)} disabled={true}/>
                        </td> */}
                        <td>
                            <input name="no" type="text" className="form-control" id="floatingInput" placeholder="No" value={no} onChange={e => changeHandler(e)} disabled={true}/>
                        </td>
                        <td>
                            <input name="nama" type="text" className="form-control" id="floatingInput" placeholder="Kegiatan" value={nama} onChange={e => changeHandler(e)} disabled={true}/>
                        </td>
                        <td>
                            <div className="control">
                                <input type="number" min='0' maxLength={7} onInput={(e) => maxLengthCheck(e)} onPaste={preventPasteNegative} onKeyPress={preventMinus} className="form-control" value={jumlah} 
                                onChange={(e) => setJumlah(e.target.value)} placeholder="Jumlah"/>
                            </div>
                        </td>
                        {/* <td>
                            <input type="number" min='0' onPaste={preventPasteNegative} onKeyPress={preventMinus} name="tindakLanjutPelayananDirawat" className="form-control" value={tindakLanjutPelayananDirawat} 
                            onChange={event => changeHandler(event)} disabled={false} />
                        </td> */}
                    </tbody>
                </table>
            </div>
        </div>
        <div className="mt-3 mb-3">
        <ToastContainer />
            <button type="submit" className="btn btn-outline-success"><HiSaveAs/> Update</button>
        </div>
    </form>
</div>
  )
}

export default FormUbahRL33