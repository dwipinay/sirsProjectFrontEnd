import React, { useState, useEffect } from 'react'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { useNavigate ,Link} from 'react-router-dom'
import style from './FormTambahRL312.module.css'
import { HiSaveAs } from 'react-icons/hi'
import { IoArrowBack } from 'react-icons/io5'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from 'react-bootstrap/esm/Spinner'

const FormTambahRL312 = () => {
    const [tahun, setTahun] = useState('2022')
    const [namaRS, setNamaRS] = useState('')
    const [alamatRS, setAlamatRS] = useState('')
    const [namaPropinsi, setNamaPropinsi] = useState('')
    const [namaKabKota, setNamaKabKota] = useState('')
    const [dataRL, setDataRL] = useState([])
    const [token, setToken] = useState('')
    const [expire, setExpire] = useState('')
    const [spinner, setSpinner] = useState(false)
    const [buttonStatus, setButtonStatus] = useState(false)
    const navigate = useNavigate()


    useEffect(() => {
        refreshToken()
       
        getRLTigaTitikDuaBelasTemplate()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

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

    const getRLTigaTitikDuaBelasTemplate = async() => {
        setSpinner(true)
        try {
            const response = await axiosJWT.get('/apisirs/getmetoda?rlid=12', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            
            const rlTemplate = response.data.data.map((value, index) => {
                return {
                    id: value.id,
                    namaRS: 0,
                    tahun: 0,
                    no: value.no,
                    metoda: value.nama,
                    konselingAnc: 0,
                    konselingPascaPersalinan: 0,
                    kbBaruBukanRujukan: 0,
                    kbBaruRujukanInap: 0,
                    kbBaruRujukanJalan: 0,
                    kbBaruPascaPersalinan: 0,
                    kbBaruAbortus: 0,
                    kbBaruLainnya: 0,
                    kunjunganUlang: 0,
                    keluhanEfekSampingJumlah: 0,
                    keluhanEfekSampingDirujuk: 0,
                    disabledInput: true,
                    checked: false
                }
            })
            setDataRL(rlTemplate)
            setSpinner(false)
            // console.log(response.data.data)
        } catch (error) {
            
        }
    }

    const changeHandlerSingle = (event) => {
        setTahun(event.target.value)
    }

    const handleFocus = (event) => event.target.select()

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
            newDataRL[index].no = event.target.value
        } else if (name === 'metoda') {
            newDataRL[index].metoda = event.target.value
        } else if (name === 'konselingAnc') {
            if(event.target.value === ''){   
                event.target.value = 0
                event.target.select(event.target.value)
                }
            newDataRL[index].konselingAnc = event.target.value
        } else if (name === 'konselingPascaPersalinan') {
            if(event.target.value === ''){   
                event.target.value = 0
                event.target.select(event.target.value)
                }
            newDataRL[index].konselingPascaPersalinan = event.target.value
        } else if (name === 'kbBaruBukanRujukan') {
            if(event.target.value === ''){   
                event.target.value = 0
                event.target.select(event.target.value)
                }
            newDataRL[index].kbBaruBukanRujukan = event.target.value
        } else if (name === 'kbBaruRujukanInap') {
            if(event.target.value === ''){   
                event.target.value = 0
                event.target.select(event.target.value)
                }
            newDataRL[index].kbBaruRujukanInap = event.target.value
        } else if (name === 'kbBaruRujukanJalan') {
            if(event.target.value === ''){   
                event.target.value = 0
                event.target.select(event.target.value)
                }
            newDataRL[index].kbBaruRujukanJalan = event.target.value
        } else if (name === 'kbBaruTotal') {
            if(event.target.value === ''){   
                event.target.value = 0
                event.target.select(event.target.value)
                }
            newDataRL[index].kbBaruTotal = event.target.value
        } else if (name === 'kbBaruPascaPersalinan') {
            if(event.target.value === ''){   
                event.target.value = 0
                event.target.select(event.target.value)
                }
            newDataRL[index].kbBaruPascaPersalinan = event.target.value
        } else if (name === 'kbBaruAbortus') {
            if(event.target.value === ''){   
                event.target.value = 0
                event.target.select(event.target.value)
                }
            newDataRL[index].kbBaruAbortus = event.target.value
        } else if (name === 'kbBaruLainnya') {
            if(event.target.value === ''){   
                event.target.value = 0
                event.target.select(event.target.value)
                }
            newDataRL[index].kbBaruLainnya = event.target.value
        } else if (name === 'kunjunganUlang') {
            if(event.target.value === ''){   
                event.target.value = 0
                event.target.select(event.target.value)
                }
            newDataRL[index].kunjunganUlang = event.target.value
        } else if (name === 'keluhanEfekSampingJumlah') {
            if(event.target.value === ''){   
                event.target.value = 0
                event.target.select(event.target.value)
                }
            newDataRL[index].keluhanEfekSampingJumlah = event.target.value
        } else if (name === 'keluhanEfekSampingDirujuk') {
            if(event.target.value === ''){   
                event.target.value = 0
                event.target.select(event.target.value)
                }

            if(parseInt(event.target.value) >  parseInt(dataRL[index].keluhanEfekSampingJumlah) ){
                alert('Total Dirujuk tidak boleh lebih besar dari Jumlah Keluhan Efek Samping')
                newDataRL[index].keluhanEfekSampingDirujuk = 0
            } else {
                newDataRL[index].keluhanEfekSampingDirujuk = event.target.value
            }
        } 
        setDataRL(newDataRL)
    }

    const Simpan = async (e) => {
        e.preventDefault()
        setSpinner(true)
        setButtonStatus(true)
        try {
            const dataRLArray = dataRL.filter((value) => {
                return value.checked === true
            }).map((value, index) => {
                let jumlahKbBaruTotal = value.kbBaruBukanRujukan + value.kbBaruRujukanInap + value.kbBaruRujukanJalan
                return {
                "metodaId": value.id,
                "konselingAnc": value.konselingAnc,
                "konselingPascaPersalinan": value.konselingPascaPersalinan,
                "kbBaruBukanRujukan": parseInt(value.kbBaruBukanRujukan),
                "kbBaruRujukanInap": parseInt(value.kbBaruRujukanInap),
                "kbBaruRujukanJalan":parseInt(value.kbBaruRujukanJalan),
                "kbBaruTotal": jumlahKbBaruTotal,
                "kbBaruPascaPersalinan": value.kbBaruPascaPersalinan,
                "kbBaruAbortus": value.kbBaruAbortus,
                "kbBaruLainnya": value.kbBaruLainnya,
                "kunjunganUlang": value.kunjunganUlang,
                "keluhanEfekSampingJumlah": value.keluhanEfekSampingJumlah,
                "keluhanEfekSampingDirujuk": value.keluhanEfekSampingDirujuk
                }
            })

            const customConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
            const result = await axiosJWT.post('/apisirs/rltigatitikduabelas',{
                tahun: parseInt(tahun),
                data: dataRLArray
            }, customConfig)
            setSpinner(false)
            console.log(result.data)
            toast('Data Berhasil Disimpan', {
                position: toast.POSITION.TOP_RIGHT
            })
            setTimeout(() => {
                navigate('/rl312')
            }, 1000);
        } catch (error) {
            toast(`Data tidak bisa disimpan karena ,${error.response.data.message}`, {
                position: toast.POSITION.TOP_RIGHT
            })
            setButtonStatus(false)
            setSpinner(false)
        }
    }
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
            <form onSubmit={Simpan}>
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
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title h5">Periode Laporan</h5>
                                <div className="form-floating" style={{width:"100%", display:"inline-block"}}>
                                    <input name="tahun" type="text" className="form-control" id="floatingInput" 
                                        placeholder="Tahun" value={tahun} onChange={e => changeHandlerSingle(e)} disabled/>
                                    <label htmlFor="floatingInput">Tahun</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-md-12">
                        <Link to={`/rl312/`} className='btn btn-info' style={{fontSize:"18px", backgroundColor: "#779D9E", color: "#FFFFFF"}}>
                            {/* <IoArrowBack size={30} style={{color:"gray",cursor: "pointer"}}/><span style={{color: "gray"}}></span> */}
                            &lt;
                            </Link>
                            <span style={{color: "gray"}}>RL 3.12 Keluarga Berencana</span>
                        
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
                                    <th style={{"width": "9%"}}>No.</th>
                                    <th style={{"width": "2%"}}></th>
                                    <th>No Metoda</th>
                                    <th>Jenis Metoda</th>
                                    <th>KONSELING ANC</th>
                                    <th>KONSELING PASCA PERSALINAN</th>
                                    <th>KB BARU DENGAN CARA MASUK_BUKAN RUJUKAN</th>
                                    <th>KB BARU DENGAN CARA MASUK_RUJUKAN R. INAP</th>
                                    <th>KB BARU DENGAN CARA MASUK_RUJUKAN R. JALAN</th>
                                    <th>KB BARU DENGAN KONDISI_PASCA PERSALINAN/NIFAS</th>
                                    <th>KB BARU DENGAN KONDISI_ABORTUS</th>
                                    <th>KB BARU DENGAN KONDISI_LAINNYA</th>
                                    <th>KUNJUNGAN ULANG</th>
                                    <th>KELUHAN EFEK SAMPING_JUMLAH</th>
                                    <th>KELUHAN EFEK SAMPING_DIRUJUK</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataRL.map((value, index) => {
                                    return (
                                        <tr key={value.id}>
                                            <td>
                                            {value.id}
                                            </td>
                                            <td style={{textAlign: "center", verticalAlign: "middle"}}>
                                                <input type="checkbox" name='check' className="form-check-input" onChange={e => changeHandler(e, index)} checked={value.checked}/>
                                            </td>
                                            <td>
                                                <input type="text" name="no" className="form-control" value={value.no} disabled={true} />
                                            </td>
                                            <td>
                                            {value.metoda}
                                            </td>
                                            <td><input type="number" min={0} maxLength={7}
                                    onInput={(e) => maxLengthCheck(e)} name="konselingAnc" className="form-control" value={value.konselingAnc} 
                                               onFocus={handleFocus} onChange={e => changeHandler(e, index)} disabled={value.disabledInput} onPaste={preventPasteNegative}
                                                onKeyPress={preventMinus}/>
                                            </td>
                                            <td><input type="number" min={0} maxLength={7}
                                    onInput={(e) => maxLengthCheck(e)} name="konselingPascaPersalinan" className="form-control" value={value.konselingPascaPersalinan} 
                                               onFocus={handleFocus} onChange={e => changeHandler(e, index)} disabled={value.disabledInput} onPaste={preventPasteNegative}
                                                onKeyPress={preventMinus}/>
                                            </td>
                                            <td><input type="number" min={0} maxLength={7}
                                    onInput={(e) => maxLengthCheck(e)} name="kbBaruBukanRujukan" className="form-control" value={value.kbBaruBukanRujukan} 
                                               onFocus={handleFocus} onChange={e => changeHandler(e, index)} disabled={value.disabledInput} onPaste={preventPasteNegative}
                                                onKeyPress={preventMinus}/>
                                            </td>
                                            <td><input type="number" min={0} maxLength={7}
                                    onInput={(e) => maxLengthCheck(e)} name="kbBaruRujukanInap" className="form-control" value={value.kbBaruRujukanInap} 
                                               onFocus={handleFocus} onChange={e => changeHandler(e, index)} disabled={value.disabledInput} onPaste={preventPasteNegative}
                                                onKeyPress={preventMinus}/>
                                            </td>
                                            <td><input type="number" min={0} maxLength={7}
                                    onInput={(e) => maxLengthCheck(e)} name="kbBaruRujukanJalan" className="form-control" value={value.kbBaruRujukanJalan} 
                                               onFocus={handleFocus} onChange={e => changeHandler(e, index)} disabled={value.disabledInput} onPaste={preventPasteNegative}
                                                onKeyPress={preventMinus}/>
                                            </td>
                                            <td><input type="number" min={0} maxLength={7}
                                    onInput={(e) => maxLengthCheck(e)} name="kbBaruPascaPersalinan" className="form-control" value={value.kbBaruPascaPersalinan} 
                                               onFocus={handleFocus} onChange={e => changeHandler(e, index)} disabled={value.disabledInput} onPaste={preventPasteNegative}
                                                onKeyPress={preventMinus}/>
                                            </td>
                                            <td><input type="number" min={0} maxLength={7}
                                    onInput={(e) => maxLengthCheck(e)} name="kbBaruAbortus" className="form-control" value={value.kbBaruAbortus} 
                                               onFocus={handleFocus} onChange={e => changeHandler(e, index)} disabled={value.disabledInput} onPaste={preventPasteNegative}
                                                onKeyPress={preventMinus}/>
                                            </td>
                                            <td><input type="number" min={0} maxLength={7}
                                    onInput={(e) => maxLengthCheck(e)} name="kbBaruLainnya" className="form-control" value={value.kbBaruLainnya} 
                                               onFocus={handleFocus} onChange={e => changeHandler(e, index)} disabled={value.disabledInput} onPaste={preventPasteNegative}
                                                onKeyPress={preventMinus}/>
                                            </td>
                                            <td><input type="number" min={0} maxLength={7}
                                    onInput={(e) => maxLengthCheck(e)} name="kunjunganUlang" className="form-control" value={value.kunjunganUlang} 
                                              onFocus={handleFocus}  onChange={e => changeHandler(e, index)} disabled={value.disabledInput} onPaste={preventPasteNegative}
                                                onKeyPress={preventMinus}/>
                                            </td>
                                            <td><input type="number" min={0} maxLength={7}
                                    onInput={(e) => maxLengthCheck(e)} name="keluhanEfekSampingJumlah" className="form-control" value={value.keluhanEfekSampingJumlah} 
                                               onFocus={handleFocus} onChange={e => changeHandler(e, index)} disabled={value.disabledInput} onPaste={preventPasteNegative}
                                                onKeyPress={preventMinus}/>
                                            </td>
                                            <td><input type="number" min={0} maxLength={7}
                                    onInput={(e) => maxLengthCheck(e)} name="keluhanEfekSampingDirujuk" className="form-control" value={value.keluhanEfekSampingDirujuk} 
                                               onFocus={handleFocus} onChange={e => changeHandler(e, index)} disabled={value.disabledInput} onPaste={preventPasteNegative}
                                                onKeyPress={preventMinus}/>
                                            </td>
                                        </tr>
                                    )
                                }) }
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="mt-3 mb-3">
                <ToastContainer />
                    <button type="submit" className="btn btn-outline-success" disabled={buttonStatus}><HiSaveAs/> Simpan</button>
                </div>
            </form>
        </div>
        
    )
}

export default FormTambahRL312