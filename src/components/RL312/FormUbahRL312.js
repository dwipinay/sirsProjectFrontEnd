import React, { useState, useEffect } from "react"
import axios from "axios"
import jwt_decode from 'jwt-decode'
import { useNavigate, useParams } from "react-router-dom"
import style from './FormTambahRL312.module.css'
import { HiSaveAs } from 'react-icons/hi'
import { IoArrowBack } from "react-icons/io5"
import { Link } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from "react-bootstrap/esm/Spinner"

export const FormUbahRL312 = () => {
    const [namaRS, setNamaRS] = useState('')
    const [alamatRS, setAlamatRS] = useState('')
    const [namaPropinsi, setNamaPropinsi] = useState('')
    const [namaKabKota, setNamaKabKota] = useState('')
    const [konseling_anc, setKonselingAnc] = useState('')
    const [konseling_pasca_persalinan, setkonselingPascaPersalinan] = useState('')
    const [kb_baru_bukan_rujukan, setkbBaruBukanRujukan] = useState('')
    const [kb_baru_rujukan_inap, setkbBaruRujukanInap] = useState('')
    const [kb_baru_rujukan_jalan, setkbBaruRujukanJalan] = useState('')
    const [kb_baru_pasca_persalinan, setkbBaruPascaPersalinan] = useState('')
    const [kb_baru_abortus, setkbBaruAbortus] = useState('')
    const [kb_baru_lainnya, setkbBaruLainnya] = useState('')
    const [kunjungan_ulang, setkunjunganUlang] = useState('')
    const [keluhan_efek_samping_jumlah, setkeluhanEfekSampingJumlah] = useState('')
    const [keluhan_efek_samping_dirujuk, setkeluhanEfekSampingDirujuk] = useState('')
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
        getRLTigaTitikDuaBelasById();

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
            
            case "konseling_anc":
                if(event.target.value === ''){
                    
                    event.target.value = 0
                    event.target.select(event.target.value)
                    }
                setKonselingAnc(event.target.value)
                break
            case "konseling_pasca_persalinan":
                if(event.target.value === ''){
                    
                    event.target.value = 0
                    event.target.select(event.target.value)
                    }
                setkonselingPascaPersalinan(event.target.value)
                break
            case "kb_baru_bukan_rujukan":
                if(event.target.value === ''){
                    
                    event.target.value = 0
                    event.target.select(event.target.value)
                    }
                setkbBaruBukanRujukan(event.target.value)
                break
            case "kb_baru_rujukan_inap":
                if(event.target.value === ''){
                    
                    event.target.value = 0
                    event.target.select(event.target.value)
                    }
                setkbBaruRujukanInap(event.target.value)
                break
            case "kb_baru_rujukan_jalan":
                if(event.target.value === ''){
                    
                    event.target.value = 0
                    event.target.select(event.target.value)
                    }
                setkbBaruRujukanJalan(event.target.value)
                break
            case "kb_baru_pasca_persalinan":
                if(event.target.value === ''){
                    
                    event.target.value = 0
                    event.target.select(event.target.value)
                    }
                setkbBaruPascaPersalinan(event.target.value)
                break
            case "kb_baru_abortus":
                if(event.target.value === ''){
                    
                    event.target.value = 0
                    event.target.select(event.target.value)
                    }
                setkbBaruAbortus(event.target.value)
                break
            case "kb_baru_lainnya":
                if(event.target.value === ''){
                    
                    event.target.value = 0
                    event.target.select(event.target.value)
                    }
                setkbBaruLainnya(event.target.value)
                break
             case "kunjungan_ulang":
                if(event.target.value === ''){
                    
                    event.target.value = 0
                    event.target.select(event.target.value)
                    }
                setkunjunganUlang(event.target.value)
                break
             case "keluhan_efek_samping_jumlah":
                if(event.target.value === ''){
                    
                    event.target.value = 0
                    event.target.select(event.target.value)
                    }
                setkeluhanEfekSampingJumlah(event.target.value)
                break
             case "keluhan_efek_samping_dirujuk":
                if(event.target.value === ''){
                    
                    event.target.value = 0
                    event.target.select(event.target.value)
                    }
                setkeluhanEfekSampingDirujuk(event.target.value)
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
    const updateDataRLTigaTitikDuaBelas = async (e) => {
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
            let kb_baru_total = parseInt(kb_baru_bukan_rujukan) + parseInt(kb_baru_rujukan_inap) + parseInt(kb_baru_rujukan_jalan)
            await axiosJWT.patch('/apisirs/rltigatitikduabelasdetail/' + id, {
           
                no,
                nama,
                konseling_anc,
                konseling_pasca_persalinan,
                kb_baru_bukan_rujukan,
                kb_baru_rujukan_inap,
                kb_baru_rujukan_jalan,
                kb_baru_total,
                kb_baru_pasca_persalinan,
                kb_baru_abortus,
                kb_baru_lainnya,
                kunjungan_ulang,
                keluhan_efek_samping_jumlah,
                keluhan_efek_samping_dirujuk
            }, customConfig);
            setSpinner(false)
            toast('Data Berhasil Diupdate', {
                position: toast.POSITION.TOP_RIGHT
            })
            setTimeout(() => {
                navigate('/rl312')
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
    
    const getRLTigaTitikDuaBelasById = async () => {
        setSpinner(true)
        const response = await axiosJWT.get('/apisirs/rltigatitikduabelasdetail/'+ id, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
   

        setNama(response.data.data.metoda.nama);
        setNo(response.data.data.metoda.no);
        setKonselingAnc(response.data.data.konseling_anc);
        setkonselingPascaPersalinan(response.data.data.konseling_pasca_persalinan);
        setkbBaruBukanRujukan(response.data.data.kb_baru_bukan_rujukan);
        setkbBaruRujukanInap(response.data.data.kb_baru_rujukan_inap);
        setkbBaruRujukanJalan(response.data.data.kb_baru_rujukan_jalan);
        // setkbBaruTotal(response.data.data.kb_baru_total);
        setkbBaruPascaPersalinan(response.data.data.kb_baru_pasca_persalinan);
        setkbBaruAbortus(response.data.data.kb_baru_abortus);
        setkbBaruLainnya(response.data.data.kb_baru_lainnya);
        setkunjunganUlang(response.data.data.kunjungan_ulang);
        setkeluhanEfekSampingJumlah(response.data.data.keluhan_efek_samping_jumlah);
        setkeluhanEfekSampingDirujuk(response.data.data.keluhan_efek_samping_dirujuk);
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
    <form onSubmit={updateDataRLTigaTitikDuaBelas}>
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
                <Link to={`/rl312/`} style={{textDecoration: "none"}}>
                    <IoArrowBack size={30} style={{color:"gray",cursor: "pointer"}}/><span style={{color: "gray"}}></span>
                    <span style={{color: "gray"}}>RL 3.12 Keluarga Berencana</span>
                </Link>
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
                            <th>No Metoda</th>
                            <th>Jenis Metoda</th>
                            <th>Konseling ANC</th>
                            <th>Konseling Pasca Persalinan</th>
                            <th>KB Baru Bukan Rujukan</th>
                            <th>KB Baru Rujukan Inap</th>
                            <th>KB Baru Rujukan Jalan</th>
                            <th>KB Baru Pasca Persalinan</th>
                            <th>KB Baru Abortus</th>
                            <th>KB Baru Lainnya</th>
                            <th>Kunjungan Ulang</th>
                            <th>Keluhan Efek Samping Jumlah</th>
                            <th>Keluhan Efek Samping Dirujuk</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <td><input name="no" type="text" className="form-control" id="floatingInput" 
                                        placeholder="No" value={no} onChange={e => changeHandler(e)} disabled={true}/>
                        </td>
                        <td>
                            {nama}
                        </td>
                        <td>
                        <div className="control">
                                <input 
                                type="number" min={0} 
                                maxLength={7}
                                onInput={(e) => maxLengthCheck(e)}
                                className="form-control" 
                                name="konseling_anc"
                                value={konseling_anc} 
                                onFocus={handleFocus}
                                    onChange={event => changeHandler(event)}
                                placeholder="Jumlah" onPaste={preventPasteNegative}
                                onKeyPress={preventMinus}/>
                            </div>
                        </td>
                        <td>
                            <div className="control">
                                <input type="number" min={0} maxLength={7}
                                    onInput={(e) => maxLengthCheck(e)} className="form-control" name="konseling_pasca_persalinan" value={konseling_pasca_persalinan} onFocus={handleFocus}
                                    onChange={event => changeHandler(event)} onPaste={preventPasteNegative}
                                onKeyPress={preventMinus}/>
                            </div>
                        </td>
                        <td>
                            <div className="control">
                                <input type="number" min={0} maxLength={7}
                                    onInput={(e) => maxLengthCheck(e)} className="form-control" name="kb_baru_bukan_rujukan" value={kb_baru_bukan_rujukan} onFocus={handleFocus}
                                    onChange={event => changeHandler(event)} onPaste={preventPasteNegative}
                                onKeyPress={preventMinus}/>
                            </div>
                        </td>
                        <td>
                            <div className="control">
                                <input type="number" min={0} maxLength={7}
                                    onInput={(e) => maxLengthCheck(e)} className="form-control" name="kb_baru_rujukan_inap" value={kb_baru_rujukan_inap} onFocus={handleFocus}
                                    onChange={event => changeHandler(event)} onPaste={preventPasteNegative}
                                onKeyPress={preventMinus}/>
                            </div>
                        </td>
                        <td>
                            <div className="control">
                                <input type="number" min={0} maxLength={7}
                                    onInput={(e) => maxLengthCheck(e)} className="form-control" name="kb_baru_rujukan_jalan" value={kb_baru_rujukan_jalan} onFocus={handleFocus}
                                    onChange={event => changeHandler(event)} onPaste={preventPasteNegative}
                                onKeyPress={preventMinus}/>
                            </div>
                        </td>
                        <td>
                            <div className="control">
                                <input type="number" min={0} maxLength={7}
                                    onInput={(e) => maxLengthCheck(e)} className="form-control" name="kb_baru_pasca_persalinan" value={kb_baru_pasca_persalinan} onFocus={handleFocus}
                                    onChange={event => changeHandler(event)} onPaste={preventPasteNegative}
                                onKeyPress={preventMinus}/>
                            </div>
                        </td>
                        <td>
                            <div className="control">
                                <input type="number" min={0} maxLength={7}
                                    onInput={(e) => maxLengthCheck(e)} className="form-control" name="kb_baru_abortus" value={kb_baru_abortus} onFocus={handleFocus}
                                    onChange={event => changeHandler(event)} onPaste={preventPasteNegative}
                                onKeyPress={preventMinus}/>
                            </div>
                        </td>
                        <td>
                            <div className="control">
                                <input type="number" min={0} maxLength={7}
                                    onInput={(e) => maxLengthCheck(e)} className="form-control" name="kb_baru_lainnya" value={kb_baru_lainnya} onFocus={handleFocus}
                                    onChange={event => changeHandler(event)} onPaste={preventPasteNegative}
                                onKeyPress={preventMinus}/>
                            </div>
                        </td>
                        <td>
                            <div className="control">
                                <input type="number" min={0} maxLength={7}
                                    onInput={(e) => maxLengthCheck(e)} className="form-control" name="kunjungan_ulang" value={kunjungan_ulang} onFocus={handleFocus}
                                    onChange={event => changeHandler(event)} onPaste={preventPasteNegative}
                                onKeyPress={preventMinus}/>
                            </div>
                        </td>
                        <td>
                            <div className="control">
                                <input type="number" min={0} maxLength={7}
                                    onInput={(e) => maxLengthCheck(e)} className="form-control" name="keluhan_efek_samping_jumlah" value={keluhan_efek_samping_jumlah} onFocus={handleFocus}
                                    onChange={event => changeHandler(event)} onPaste={preventPasteNegative}
                                onKeyPress={preventMinus}/>
                            </div>
                        </td>
                        <td>
                            <div className="control">
                                <input type="number" min={0} maxLength={7}
                                    onInput={(e) => maxLengthCheck(e)} className="form-control" name="keluhan_efek_samping_dirujuk" value={keluhan_efek_samping_dirujuk} onFocus={handleFocus}
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
export default FormUbahRL312