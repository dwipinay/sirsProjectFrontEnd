import React, { useState, useEffect } from "react"
import axios from "axios"
import jwt_decode from 'jwt-decode'
import { useNavigate, useParams } from "react-router-dom"
import style from './FormTambahRL54.module.css'
import { HiSaveAs } from 'react-icons/hi'
import { Link } from "react-router-dom"
import { IoArrowBack } from "react-icons/io5"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Table from 'react-bootstrap/Table';
import Spinner from "react-bootstrap/esm/Spinner"


export const FormUbahRL54 = () => {
 
    const [namaRS, setNamaRS] = useState('')
    const [alamatRS, setAlamatRS] = useState('')
    const [namaPropinsi, setNamaPropinsi] = useState('')
    const [namaKabKota, setNamaKabKota] = useState('')
    const [kode_icd_10, setKodeIcd10] = useState('')
    const [deskripsi, setDeskripsi] = useState('')
    const [kasus_baru_Lk, setKasusBaruLk] = useState('')
    const [kasus_baru_Pr, setKasusBaruPr] = useState('')
    const [jumlah_kunjungan, setJumlahKunjungan] = useState('')
    const [no, setNo] = useState('')
    const [token, setToken] = useState('')
    const [expire, setExpire] = useState('')
    const [buttonStatus, setButtonStatus]=useState(false)
    const [spinner, setSpinner] = useState(false)
    const navigate = useNavigate()
    const { id } = useParams();
    
    useEffect(() => {
        refreshToken()
        getRLLimaTitikEmpatById();

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

    const blurHandler = (event, index) => {
       
        if(parseInt(jumlah_kunjungan) <  (parseInt(kasus_baru_Lk) + parseInt(kasus_baru_Pr)))
       
        alert('Jumlah Kunjungan tidak boleh lebih kecil dari Jumlah Kasus Baru')
        
                
          
      }


      const handleFocus = (event) => event.target.select();

      const changeHandler = (event, index) => {
        const targetName = event.target.name
        switch (targetName) {
            
            case "kasus_baru_lk":
                if(event.target.value === ''){
                    
                    event.target.value = 0
                    event.target.select(event.target.value)
                    }
                setKasusBaruLk(event.target.value)
                break
                case "kasus_baru_pr":
                    if(event.target.value === ''){
                        
                        event.target.value = 0
                        event.target.select(event.target.value)
                        }
                    setKasusBaruPr(event.target.value)
                    break
                case "jumlah_kunjungan":
                    if(event.target.value === ''){
                            
                            event.target.value = 0
                            event.target.select(event.target.value)
                            }
                    setJumlahKunjungan(event.target.value)
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

    const updateDataRLLimaTitikEmpat = async (e) => {
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
            let jumlah_kasus_baru = parseInt(kasus_baru_Lk) + parseInt(kasus_baru_Pr)
            await axiosJWT.patch('/apisirs/rllimatitikempatdetail/' + id, {
                kode_icd_10,
                deskripsi,
                kasus_baru_Lk,
                kasus_baru_Pr,
                jumlah_kasus_baru,
                jumlah_kunjungan
            }, customConfig);
            setSpinner(false)
            toast('Data Berhasil Diupdate', {
                position: toast.POSITION.TOP_RIGHT
            })
            setTimeout(() => {
                navigate('/rl54')
            }, 1000);
        } catch (error) {
            console.log(error)
            toast('Data Gagal Diupdate', {
                position: toast.POSITION.TOP_RIGHT
            })
            setButtonStatus(false)
            setSpinner(false)
        }
        
    }
    
    const getRLLimaTitikEmpatById = async () => {
        setSpinner(true)
        const response = await axiosJWT.get('/apisirs/rllimatitikempatdetail/'+ id, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        
        setNo(response.data.data.no_urut.no);
        setKodeIcd10(response.data.data.kode_icd_10);
        setDeskripsi(response.data.data.deskripsi);
        setKasusBaruLk(response.data.data.kasus_baru_Lk);
        setKasusBaruPr(response.data.data.kasus_baru_Pr);
        setJumlahKunjungan(response.data.data.jumlah_kunjungan);
        setSpinner(false)
        // console.log(response.data.data);        
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
                <form onSubmit={updateDataRLLimaTitikEmpat}>
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
                            <Link to={`/rl54/`} className='btn btn-info' style={{fontSize:"18px", backgroundColor: "#779D9E", color: "#FFFFFF"}}>
                                {/* <IoArrowBack size={30} style={{color:"gray",cursor: "pointer"}}/><span style={{color: "gray"}}></span> */}
                                &lt;
                                </Link>
                                <span style={{color: "gray"}}>RL 5.4 10 Besar Penyakit Rawat Jalan</span>
                            
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
                                        <th style={{"width": "6%"}}>No Urut</th>
                                        <th>KODE ICD 10</th>
                                        <th>Deskripsi</th>
                                        <th>Kasus Baru menurut Jenis Kelamin LK</th>
                                        <th>Kasus Baru menurut Jenis Kelamin PR</th>
                                        <th>Jumlah Kunjungan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <td><input name="no" type="text" className="form-control" id="floatingInput" 
                                                    placeholder="no" value={no} onChange={e => changeHandler(e)} disabled={true}/>
                                    </td>
                                    <td>{kode_icd_10}
                                    </td>
                                    <td>{deskripsi}
                                    </td>
                                    <td><div className="control">
                                            <input type="number" min={0} maxLength={7}
                                    onInput={(e) => maxLengthCheck(e)} className="form-control" name="kasus_baru_lk" value={kasus_baru_Lk}  onFocus={handleFocus}
                                    onChange={event => changeHandler(event)} onPaste={preventPasteNegative}
                                            onKeyPress={preventMinus}/>
                                        </div>
                                    </td>
                                    <td><div className="control">
                                            <input type="number" min={0} maxLength={7}
                                    onInput={(e) => maxLengthCheck(e)} className="form-control" name="kasus_baru_pr" value={kasus_baru_Pr}  onFocus={handleFocus}
                                    onChange={event => changeHandler(event)} onPaste={preventPasteNegative}
                                            onKeyPress={preventMinus}/>
                                        </div>
                                    </td>
                                    <td><div className="control">
                                            <input type="number" min={0} maxLength={7}
                                    onInput={(e) => maxLengthCheck(e)} className="form-control" name="jumlah_kunjungan" value={jumlah_kunjungan}  onFocus={handleFocus}
                                    onChange={event => changeHandler(event)} onBlur={e => blurHandler (parseInt(e.target.value))} onPaste={preventPasteNegative}
                                            onKeyPress={preventMinus}/>
                                        </div>
                                    </td>
                                </tbody>
                            </Table>
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
export default FormUbahRL54