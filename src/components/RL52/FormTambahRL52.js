import React, { useState, useEffect } from 'react'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { useNavigate, Link } from 'react-router-dom'
import style from './FormTambahRL52.module.css'
import { HiSaveAs } from 'react-icons/hi'
import { IoArrowBack } from 'react-icons/io5'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from 'react-bootstrap/Spinner'

const FormTambahRL52 = () => {
    const [tahun, setTahun] = useState('2022')
    const [bulan, setBulan] = useState('01')
    const [namaRS, setNamaRS] = useState('')
    const [alamatRS, setAlamatRS] = useState('')
    const [namaPropinsi, setNamaPropinsi] = useState('')
    const [namaKabKota, setNamaKabKota] = useState('')
    const [dataRL, setDataRL] = useState([])
    const [token, setToken] = useState('')
    const [expire, setExpire] = useState('')
    const navigate = useNavigate()
    const [buttonStatus, setButtonStatus] = useState(false)
    const [spinner, setSpinner]= useState(false)

    useEffect(() => {
        refreshToken()
        getRLLimaTitikDuaTemplate()

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
            setNamaRS(response.data.data[0].nama)
            setAlamatRS(response.data.data[0].alamat)
            setNamaPropinsi(response.data.data[0].propinsi.nama)
            setNamaKabKota(response.data.data[0].kabKota.nama)
        } catch (error) {
            
        }
    }

    const getRLLimaTitikDuaTemplate = async() => {
        setSpinner(true)
        try {
            const response = await axiosJWT.get('/apisirs/jeniskegiatan?rlid=22', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            
            const rlTemplate = response.data.data.map((value, index) => {
                return {
                    id: value.id,
                    no: value.no,
                    jenisKegiatan: value.nama,
                    jumlah: 0,
                    disabledInput: true,
                    checked: false
                }
            })
            setDataRL(rlTemplate)
            setSpinner(false)
        } catch (error) {
            
        }
    }

    const changeHandlerSingle = (event) => {
        const name = event.target.name
        if (name === 'tahun') {
            setTahun(parseInt(event.target.value))
        } else if (name === 'bulan') {
            setBulan(parseInt(event.target.value))
        }
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
        } else if (name === 'jumlah') {
            if(event.target.value === ''){
                    
                event.target.value = 0
                event.target.select(event.target.value)
                }
            newDataRL[index].jumlah = parseInt(event.target.value)
        }
        
        setDataRL(newDataRL)

        let jumlahDataRL = [...dataRL]

        jumlahDataRL[29].jumlah = (
            parseInt(dataRL[0].jumlah) +
            parseInt(dataRL[1].jumlah) +
            parseInt(dataRL[2].jumlah) +
            parseInt(dataRL[3].jumlah) +
            parseInt(dataRL[4].jumlah) +
            parseInt(dataRL[5].jumlah) +
            parseInt(dataRL[6].jumlah) +
            parseInt(dataRL[7].jumlah) +
            parseInt(dataRL[8].jumlah) +
            parseInt(dataRL[9].jumlah) +
            parseInt(dataRL[10].jumlah) +
            parseInt(dataRL[11].jumlah) +
            parseInt(dataRL[12].jumlah) +
            parseInt(dataRL[13].jumlah) +
            parseInt(dataRL[14].jumlah) +
            parseInt(dataRL[15].jumlah) +
            parseInt(dataRL[16].jumlah) +
            parseInt(dataRL[17].jumlah) +
            parseInt(dataRL[18].jumlah) +
            parseInt(dataRL[19].jumlah) +
            parseInt(dataRL[20].jumlah) +
            parseInt(dataRL[21].jumlah) +
            parseInt(dataRL[22].jumlah) +
            parseInt(dataRL[23].jumlah) +
            parseInt(dataRL[24].jumlah) +
            parseInt(dataRL[25].jumlah) +
            parseInt(dataRL[26].jumlah) +
            parseInt(dataRL[27].jumlah) +
            parseInt(dataRL[28].jumlah) 
        )

        setDataRL(jumlahDataRL)
    }

    const Simpan = async (e) => {
        let date = (tahun+'-'+bulan+'-01');
        e.preventDefault()
        setSpinner(true)
        setButtonStatus(true)
        try {
            const dataRLArray = dataRL.filter((value) => {
                return value.checked === true
            }).map((value, index) => {
                return {
                    "jenisKegiatanId": value.id,
                    "jumlah": value.jumlah
                }
            })

            const customConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
            await axiosJWT.post('/apisirs/rllimatitikdua',{
                tahun: parseInt(tahun),
                tahunDanBulan : date,
                data: dataRLArray
            }, customConfig)
            // console.log(result.data)
            setSpinner(false)
            toast('Data Berhasil Disimpan', {
                position: toast.POSITION.TOP_RIGHT
            })
            setTimeout(() => {
                navigate('/rl52')
            }, 1000);
        } catch (error) {
            toast(`Data tidak bisa disimpan karena ,${error.response.data.message}`, {
                position: toast.POSITION.TOP_RIGHT
            })
            setButtonStatus(false)
            setSpinner(false)
        }
    }

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

    const handleFocus = ((event) => {
        event.target.select()
    })

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
                                <div className="form-floating" style={{width:"100%", display:"inline-block"}}>
                                    {/* <input name="tahun" type="text" className="form-control" id="floatingInput" 
                                        placeholder="Tahun" value={tahun} onChange={e => changeHandlerSingle(e)}/> */}
                                    <select name="tahun" className="form-control" id="tahun" onChange={e => changeHandlerSingle(e)}>
                                        <option value="2022">2022</option>
                                        <option value="2023">2023</option>
                                    </select>
                                    <label htmlFor="tahun">Tahun</label>
                                </div>
                                <div className="form-floating" style={{width:"100%", display:"inline-block"}}>
                                    <select name="bulan" className="form-control" id="bulan" onChange={e => changeHandlerSingle(e)}>
                                        <option value="01">Januari</option>
                                        <option value="02">Februari</option>
                                        <option value="03">Maret</option>
                                        <option value="04">April</option>
                                        <option value="05">Mei</option>
                                        <option value="06">Juni</option>
                                        <option value="07">Juli</option>
                                        <option value="08">Agustus</option>
                                        <option value="09">September</option>
                                        <option value="10">Oktober</option>
                                        <option value="11">November</option>
                                        <option value="12">Desember</option>
                                    </select>
                                    <label htmlFor="bulan">Bulan</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-md-12">
                        <Link to={`/rl52/`} style={{textDecoration: "none"}}>
                            <IoArrowBack size={30} style={{color:"gray",cursor: "pointer"}}/><span style={{color: "gray"}}></span>
                            <span style={{color:"gray"}}>Tambah data RL 5.2 -  Kunjungan Rawat Jalan</span>
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
                                    <th style={{"width": "5%"}}>No.</th>
                                    <th style={{"width": "3%"}}></th>
                                    <th style={{"width": "40%"}}>Jenis Kegiatan</th>
                                    <th>Jumlah</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataRL.map((value, index) => {
                                    let disabled = true
                                    let visibled = true
                                    if(value.no == 99){
                                        disabled = true
                                        visibled = "none" 
                                    } else {
                                        disabled = false
                                        visibled = "block"
                                    }
                                    return (
                                        <tr key={value.id}>
                                            <td>
                                                <input type='hidden' name='id' className="form-control" value={value.id} disabled={true}/>
                                                <input type='text' name='no' className="form-control" value={value.no} disabled={true}/>
                                            </td>
                                            <td style={{textAlign: "center", verticalAlign: "middle"}}>
                                                <input type="checkbox" name='check' className="form-check-input" onChange={e => changeHandler(e, index)} checked={value.checked} disabled={disabled} style={{display: visibled}}/>
                                            </td>
                                            <td>
                                                <input type="text" name="jenisKegiatan" className="form-control" value={value.jenisKegiatan} disabled={true} />
                                            </td>
                                            <td>
                                                <input type="number" min="0" onFocus={handleFocus} maxLength={7} onInput={(e) => maxLengthCheck(e)}name="jumlah" className="form-control" value={value.jumlah} 
                                                        onChange={e => changeHandler(e, index)} disabled={value.disabledInput} onPaste={preventPasteNegative} onKeyPress={preventMinus} />
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
                    <button type="submit" disabled={buttonStatus} className="btn btn-outline-success"><HiSaveAs/> Simpan</button>
                </div>
            </form>
        </div>
    )
}

export default FormTambahRL52