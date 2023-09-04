import React, { useState, useEffect } from "react"
import axios from "axios"
import jwt_decode from 'jwt-decode'
import { useNavigate, useParams } from "react-router-dom"
import style from './FormTambahRL37.module.css'
import { HiSaveAs } from 'react-icons/hi'
import { IoArrowBack } from "react-icons/io5"
import { Link } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from 'react-bootstrap/Spinner';

export const FormUbahRL37 = () => {

    const [namaRS, setNamaRS] = useState('')
    const [alamatRS, setAlamatRS] = useState('')
    const [namaPropinsi, setNamaPropinsi] = useState('')
    const [namaKabKota, setNamaKabKota] = useState('')

    const [jumlah, setJumlah] = useState(0)
    const [no, setNo] = useState('')
    const [nama, setNama] = useState('')
    // const [dataRL, setDataRL] = useState([])
    const [token, setToken] = useState('')
    const [expire, setExpire] = useState('')
    const [buttonStatus, setButtonStatus] = useState(false)
    const [spinner, setSpinner]= useState(false)
    const navigate = useNavigate()
    const { id } = useParams();
    
    useEffect(() => {
        refreshToken()
        getRLTigaTitikTujuhById();

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

    const handleFocus = (event) => event.target.select();

    const changeHandler = (event, index) => {
        const targetName = event.target.name
        switch (targetName) {
            
            case "jumlah":
                if(event.target.value === ''){
                    
                    event.target.value = 0
                    event.target.select(event.target.value)
                    }
                setJumlah(event.target.value)
                break
            
            default:
                break
        }
    }


    const getDataRS = async (id) => {
        try {
            const response = await axiosJWT.get('/apisirs/rumahsakit/' + id, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
           
            setNamaRS(response.data.data[0].nama)
            setAlamatRS(response.data.data[0].alamat)
            setNamaPropinsi(response.data.data[0].propinsi.nama)
            setNamaKabKota(response.data.data[0].kabKota.nama)
        } catch (error) {
            
        }
    }
    const updateDataRLTigaTitikTujuh = async (e) => {
        e.preventDefault();
        setSpinner(true)
        setButtonStatus(true)
        try {
            const customConfig = {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    }
             await axiosJWT.patch('/apisirs/rltigatitiktujuhdetail/' + id, {
             
                no,
                nama,
                jumlah,
            }, customConfig)
            setSpinner(false)
            toast('Data Berhasil Diupdate', {
                position: toast.POSITION.TOP_RIGHT
            })
            setTimeout(() => {
                navigate('/rl37')
            }, 1000);
        } catch (error) {
            console.log(error)
            toast('Data Gagal Diupdate', {
                position: toast.POSITION.TOP_RIGHT
            })
            setButtonStatus(false)
            setSpinner(false)
        }
       
    };
    
    const getRLTigaTitikTujuhById = async () => {
        setSpinner(true)
        const response = await axiosJWT.get('/apisirs/rltigatitiktujuhdetail/'+ id, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        setSpinner(false)
        setNama(response.data.data.jenis_kegiatan.nama);
         setNo(response.data.data.jenis_kegiatan.no);
        setJumlah(response.data.data.jumlah);
        console.log(response.data.data.jumlah);
        
        
    };
    const preventPasteNegative = (e) => {
        const clipboardData = e.clipboardData || window.clipboardData;
        const pastedData = parseFloat(clipboardData.getData('text'));
    
        if (pastedData < 0) {
            e.preventDefault();
        }
    }
    
    const preventMinus = (e) => {
        if (e.code === 'Minus') {
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
    <form onSubmit={updateDataRLTigaTitikTujuh}>
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
           
        </div>
        <div className="row mt-3">
            <div className="col-md-12">
                <Link to={`/rl37/`} className='btn btn-info' style={{fontSize:"18px", backgroundColor: "#779D9E", color: "#FFFFFF"}}>
                    {/* <IoArrowBack size={30} style={{color:"gray",cursor: "pointer"}}/><span style={{color: "gray"}}></span> */}
                    &lt;
                    </Link>
                    <span style={{color: "gray"}}>RL 3.7 Radiologi</span>
                
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
                            <th>No Kegiatan</th>
                            <th>Jenis Kegiatan</th>
                            <th>Jumlah</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <td><input name="no" type="text" className="form-control" id="floatingInput" 
                                        placeholder="No" value={no} onChange={e => changeHandler(e)} disabled={true}/>
                        </td>
                        <td><input name="nama" type="text" className="form-control" id="floatingInput" 
                            placeholder="Kegiatan" value={nama} onChange={e => changeHandler(e)} disabled={true}/>
                        </td>
                        <td>
                        {nama === "Tidak Ada Data" &&
                            <div className="control">
                                <input
                                    type="number" min={0} maxLength={7}
                                    onInput={(e) => maxLengthCheck(e)}
                                    className="form-control"
                                    name="jumlah"
                                    value={jumlah}
                                    onFocus={handleFocus}
                                    onChange={event => changeHandler(event)}
                                    placeholder="Jumlah" onPaste={preventPasteNegative}
                                    onKeyPress={preventMinus}
                                    disabled={true}
                                />
                            </div>
                        }
                        {nama !== "Tidak Ada Data" &&
                        <div className="control">
                            <input
                                type="number" min={0} maxLength={7}
                                onInput={(e) => maxLengthCheck(e)}
                                className="form-control"
                                name="jumlah"
                                value={jumlah}
                                onFocus={handleFocus}
                                onChange={event => changeHandler(event)}
                                placeholder="Jumlah" onPaste={preventPasteNegative}
                                onKeyPress={preventMinus}
                            />
                        </div>
                    }
                        </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div className="mt-3 mb-3">
        <ToastContainer />
            <button type="submit" className="btn btn-outline-success" disabled={buttonStatus}><HiSaveAs/> Update</button>
        </div>
    </form>
</div>
  )
}
export default FormUbahRL37