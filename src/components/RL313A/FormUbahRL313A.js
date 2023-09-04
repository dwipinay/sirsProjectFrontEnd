import React, { useState, useEffect } from "react"
import axios from "axios"
import jwt_decode from 'jwt-decode'
import { useNavigate, useParams } from "react-router-dom"
import style from './FormTambahRL313A.module.css'
import { HiSaveAs } from 'react-icons/hi'
import { Link } from "react-router-dom"
import { IoArrowBack } from "react-icons/io5"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from "react-bootstrap/esm/Spinner"

export const FormUbahRL313A = () => {
    const [namaRS, setNamaRS] = useState('')
    const [alamatRS, setAlamatRS] = useState('')
    const [namaPropinsi, setNamaPropinsi] = useState('')
    const [namaKabKota, setNamaKabKota] = useState('')
    const [jumlah_item_obat, setJumlahItemObat] = useState('')
    const [jumlah_item_obat_rs, setJumlahItemObatRs] = useState('')
    const [jumlah_item_obat_formulatorium, setJumlahItemObatFormulatorium] = useState('')
    const [no, setNo] = useState('')
    const [nama, setNama] = useState('')
    const [token, setToken] = useState('')
    const [expire, setExpire] = useState('')
    const [spinner, setSpinner] = useState(false)
    const [buttonStatus, setButtonStatus] = useState(false)
    const navigate = useNavigate()
    const { id } = useParams();
    
    useEffect(() => {
        refreshToken()
        getRLTigaTitikTigaBelasAById();

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
            case "jumlah_item_obat":
                if(event.target.value === ''){
                    
                    event.target.value = 0
                    event.target.select(event.target.value)
                    }
                setJumlahItemObat(event.target.value)
                break
            case "jumlah_item_obat_rs":
                if(event.target.value === ''){
                    
                    event.target.value = 0
                    event.target.select(event.target.value)
                    }
                setJumlahItemObatRs(event.target.value)
                break
            case "jumlah_item_obat_formulatorium":
                if(event.target.value === ''){
                    
                    event.target.value = 0
                    event.target.select(event.target.value)
                    }
                setJumlahItemObatFormulatorium(event.target.value)
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
    const updateDataRLTigaTitikTigaBelasA = async (e) => {
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
           await axiosJWT.patch('/apisirs/rltigatitiktigabelasadetail/' + id, {
                jumlah_item_obat_formulatorium,
                no,
                nama,
                jumlah_item_obat,
                jumlah_item_obat_rs
            }, customConfig);
            setSpinner(false)
            toast('Data Berhasil Diupdate', {
                position: toast.POSITION.TOP_RIGHT
            })
            setTimeout(() => {
                navigate('/rl313A')
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
    
    const getRLTigaTitikTigaBelasAById = async () => {
        setSpinner(true)
        const response = await axiosJWT.get('/apisirs/rltigatitiktigabelasadetail/'+ id, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        
        setNama(response.data.data.golongan_obat.nama);
        setNo(response.data.data.golongan_obat.no);
        setJumlahItemObat(response.data.data.jumlah_item_obat);
        setJumlahItemObatRs(response.data.data.jumlah_item_obat_rs);
        setJumlahItemObatFormulatorium(response.data.data.jumlah_item_obat_formulatorium);
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
    <form onSubmit={updateDataRLTigaTitikTigaBelasA}>
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
                <Link to={`/rl313a/`} className='btn btn-info' style={{fontSize:"18px", backgroundColor: "#779D9E", color: "#FFFFFF"}}>
                    {/* <IoArrowBack size={30} style={{color:"gray",cursor: "pointer"}}/><span style={{color: "gray"}}></span> */}
                    &lt;
                    </Link>
                    <span style={{color: "gray"}}>RL 3.13 Obat Pelayanan Resep</span>
                
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
                           
                            <th>No Golongan Obat</th>
                            <th>Golongan Obat</th>
                            <th>JUMLAH ITEM OBAT</th>
                            <th>JUMLAH ITEM OBAT YANG TERSEDIA DI RUMAH SAKIT</th>
                            <th>JUMLAH ITEM OBAT FORMULATORIUM TERSEDIA DIRUMAH SAKIT</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <td><center>{no}</center>
                        </td>
                        <td>{nama}
                        </td>
                        <td><div className="control">
                                <input type="number" min={0} maxLength={7}
                                    onInput={(e) => maxLengthCheck(e)} className="form-control" name="jumlah_item_obat" value={jumlah_item_obat} onFocus={handleFocus}
                                    onChange={event => changeHandler(event)} onPaste={preventPasteNegative}
                                onKeyPress={preventMinus} />
                            </div>
                        </td>
                        <td><div className="control">
                                <input type="number" min={0} maxLength={7}
                                    onInput={(e) => maxLengthCheck(e)} className="form-control" name="jumlah_item_obat_rs" value={jumlah_item_obat_rs} onFocus={handleFocus}
                                    onChange={event => changeHandler(event)} onPaste={preventPasteNegative}
                                onKeyPress={preventMinus} />
                            </div>
                        </td>
                        <td><div className="control">
                                <input type="number" min={0} maxLength={7}
                                    onInput={(e) => maxLengthCheck(e)} className="form-control" name="jumlah_item_obat_formulatorium" value={jumlah_item_obat_formulatorium} onFocus={handleFocus}
                                    onChange={event => changeHandler(event)} onPaste={preventPasteNegative}
                                onKeyPress={preventMinus}/>
                            </div>
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
export default FormUbahRL313A