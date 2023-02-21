import React, { useState, useEffect } from "react"
import axios from "axios"
import jwt_decode from 'jwt-decode'
import { useNavigate, useParams } from "react-router-dom"
import style from './FormTambahRL314.module.css'
import { HiSaveAs } from 'react-icons/hi'
import { IoArrowBack } from 'react-icons/io5'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom'
 
export const FormUbahRL314 = () => {
    const [tahun, setTahun] = useState('')
    const [namaRS, setNamaRS] = useState('')
    const [alamatRS, setAlamatRS] = useState('')
    const [namaPropinsi, setNamaPropinsi] = useState('')
    const [namaKabKota, setNamaKabKota] = useState('')
    const [jenisSpesialis, setJenisSpesialis] = useState('')
    const [rujukanDiterimaDariPuskesmas,setrujukanDiterimaDariPuskesmas] =useState('')
    const [rujukanDiterimaDariFasilitasKesehatanLain,setrujukanDiterimaDariFasilitasKesehatanLain] =useState('')
    const [rujukanDiterimaDariRsLain,setrujukanDiterimaDariRsLain] =useState('')
    const [rujukanDikembalikanKePuskesmas,setrujukanDikembalikanKePuskesmas] =useState('')
    const [rujukanDikembalikanKeFasilitasKesehatanLain,setrujukanDikembalikanKeFasilitasKesehatanLain] =useState('')
    const [rujukanDikembalikanKeRsAsal,setrujukanDikembalikanKeRsAsal] =useState('')
    const [dirujukanPasienRujukan,setdirujukanPasienRujukan] =useState('')
    const [dirujukPasienDatangSendiri,setdirujukPasienDatangSendiri] =useState('')
    const [dirujukDiterimaKembali,setdirujukDiterimaKembali] =useState('')
    const [dataRL, setDataRL] = useState([])
    const [token, setToken] = useState('')
    const [expire, setExpire] = useState('')
    const navigate = useNavigate()
    const { id } = useParams();
    
    useEffect(() => {
        refreshToken()
        getDataRLTigaTitikEmpatBelasDetailById(id);
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

    const getDataRLTigaTitikEmpatBelasDetailById = async (id) => {
        try {
            const response = await axiosJWT.get('/apisirs/rltigatitikempatbelasdetail/' + id, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            // console.log(response.data.data[0])
            setJenisSpesialis(response.data.data[0].jenis_spesialisasi.nama)
            setrujukanDiterimaDariPuskesmas(response.data.data[0].rujukan_diterima_dari_puskesmas)
            setrujukanDiterimaDariFasilitasKesehatanLain(response.data.data[0].rujukan_diterima_dari_fasilitas_kesehatan_lain)
            setrujukanDiterimaDariRsLain(response.data.data[0].rujukan_diterima_dari_rs_lain)
            setrujukanDikembalikanKePuskesmas(response.data.data[0].rujukan_dikembalikan_ke_puskesmas)
            setrujukanDikembalikanKeFasilitasKesehatanLain(response.data.data[0].rujukan_dikembalikan_ke_fasilitas_kesehatan_lain)
            setrujukanDikembalikanKeRsAsal(response.data.data[0].rujukan_dikembalikan_ke_rs_asal)
            setdirujukanPasienRujukan(response.data.data[0].dirujukan_pasien_rujukan)
            setdirujukPasienDatangSendiri(response.data.data[0].dirujuk_pasien_datang_sendiri)
            setdirujukDiterimaKembali(response.data.data[0].dirujuk_diterima_kembali)
        } catch (error) {
            console.log(error)
        }
    }

    const changeHandler = (event, index) => {
        // console.log(event)
        if (event.target.value === '') {
            event.target.value = 0
            event.target.select(event.target.value)
          }
        const targetName = event.target.name
        switch (targetName) {
            case "rujukanDiterimaDariPuskesmas":
                setrujukanDiterimaDariPuskesmas(event.target.value)
                break
            case "rujukanDiterimaDariFasilitasKesehatanLain":
                setrujukanDiterimaDariFasilitasKesehatanLain(event.target.value)
                break
            case "rujukanDiterimaDariRsLain":
                setrujukanDiterimaDariRsLain(event.target.value)
                break
            case "rujukanDikembalikanKePuskesmas":
                setrujukanDikembalikanKePuskesmas(event.target.value)
                break
            case "rujukanDikembalikanKeFasilitasKesehatanLain":
                setrujukanDikembalikanKeFasilitasKesehatanLain(event.target.value)
                break
            case "rujukanDikembalikanKeRsAsal":
                setrujukanDikembalikanKeRsAsal(event.target.value)
                break
            case "dirujukanPasienRujukan":
                setdirujukanPasienRujukan(event.target.value)
                break
            case "dirujukPasienDatangSendiri":
                setdirujukPasienDatangSendiri(event.target.value)
                break
            case "dirujukDiterimaKembali":
                setdirujukDiterimaKembali(event.target.value)
                break
        }
        
    }

    const Simpan = async (e) => {
        e.preventDefault()
        try {
            const data = {
                "rujukan_diterima_dari_puskesmas": rujukanDiterimaDariPuskesmas,
                "rujukan_diterima_dari_fasilitas_kesehatan_lain": rujukanDiterimaDariFasilitasKesehatanLain,
                "rujukan_diterima_dari_rs_lain": rujukanDiterimaDariRsLain,
                "rujukan_dikembalikan_ke_puskesmas": rujukanDikembalikanKePuskesmas,
                "rujukan_dikembalikan_ke_fasilitas_kesehatan_lain": rujukanDikembalikanKeFasilitasKesehatanLain,
                "rujukan_dikembalikan_ke_rs_asal": rujukanDikembalikanKeRsAsal,
                "dirujukan_pasien_rujukan": dirujukanPasienRujukan,
                "dirujuk_pasien_datang_sendiri": dirujukPasienDatangSendiri,
                "dirujuk_diterima_kembali": dirujukDiterimaKembali
            }

            const customConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }

            const result = await axiosJWT.patch('/apisirs/rltigatitikempatbelasdetail/' + id, data, customConfig)
            
            toast('Data Berhasil Diubah', {
                position: toast.POSITION.TOP_RIGHT
            })
            setTimeout(() => {
                navigate('/rl314')
            }, 1000);
        } catch (error) {
            console.log(error)
            toast('Data Gagal Disimpan', {
                position: toast.POSITION.TOP_RIGHT
            })
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
            <Link to={`/rl314/`} style={{textDecoration: "none"}}>
                <IoArrowBack size={30} style={{color:"gray",cursor: "pointer"}}/><span style={{color: "gray"}}>RL 3.14 Rujukan</span>
            </Link>
        <h3></h3>
                <table className={style.rlTable}>
                    <thead>
                        <tr>
                        {/* <th style={{"width": "6%"}}>No.</th> */}
                        <th style={{"width": "5%"}}>No Kegiatan</th>
                        {/* <th style={{"width": "3%"}}></th> */}
                        <th style={{"width": "20%"}}>Jenis Spesialisasi</th>
                        <th>Rujukan Diterima Dari Puskesmas</th>
                        <th>Rujukan Diterima Dari Fasilitas Kesehatan Lain</th>
                        <th>Rujukan Diterima Dari Rumah Sakit Lain</th>
                        <th>Rujukan Dikembalikan Ke Puskesmas</th>
                        <th>Rujukan Dikembalikan Ke Fasilitas Kesehatan Lain</th>
                        <th>Rujukan Dikembalikan Ke Rumah Sakit Asal</th>
                        <th>Dirujuk Pasien Rujukan</th>
                        <th>Dirujuk Pasien Datang Sendiri</th>
                        <th>Dirujuk Diterima Kembali</th>
                        </tr>
                    </thead> 
                    <tbody>
                    <td>
                        <input type='text' name='id' className="form-control" value="1" disabled={true}/>
                    </td>
                    <td>
                        <input type="text" name="jenisSpesialis" className="form-control" value={jenisSpesialis} disabled={true} />
                    </td>
                    <td>
                        <input type="number" min='0' maxLength={7} onInput={(e) => maxLengthCheck(e)} onPaste={preventPasteNegative} onKeyPress={preventMinus} name="rujukanDiterimaDariPuskesmas" className="form-control" value={rujukanDiterimaDariPuskesmas} 
                        onChange={e => changeHandler(e)} />
                    </td>
                    <td>
                        <input type="number" min='0' maxLength={7} onInput={(e) => maxLengthCheck(e)} onPaste={preventPasteNegative} onKeyPress={preventMinus} name="rujukanDiterimaDariFasilitasKesehatanLain" className="form-control" value={rujukanDiterimaDariFasilitasKesehatanLain} 
                        onChange={e => changeHandler(e)} />
                    </td>
                    <td>
                        <input type="number" min='0' maxLength={7} onInput={(e) => maxLengthCheck(e)} onPaste={preventPasteNegative} onKeyPress={preventMinus} name="rujukanDiterimaDariRsLain" className="form-control" value={rujukanDiterimaDariRsLain} 
                        onChange={e => changeHandler(e)} />
                    </td>
                    <td>
                    <input type="number" min='0' maxLength={7} onInput={(e) => maxLengthCheck(e)} onPaste={preventPasteNegative} onKeyPress={preventMinus} name="rujukanDikembalikanKePuskesmas" className="form-control" value={rujukanDikembalikanKePuskesmas} 
                    onChange={e => changeHandler(e)} />
                    </td>
                    <td>
                        <input type="number" min='0' maxLength={7} onInput={(e) => maxLengthCheck(e)} onPaste={preventPasteNegative} onKeyPress={preventMinus} name="rujukanDikembalikanKeFasilitasKesehatanLain" className="form-control" value={rujukanDikembalikanKeFasilitasKesehatanLain} 
                        onChange={e => changeHandler(e)} />
                    </td>
                    <td>
                        <input type="number" min='0' maxLength={7} onInput={(e) => maxLengthCheck(e)} onPaste={preventPasteNegative} onKeyPress={preventMinus} name="rujukanDikembalikanKeRsAsal" className="form-control" value={rujukanDikembalikanKeRsAsal} 
                        onChange={e => changeHandler(e)} />
                    </td>
                    <td>
                        <input type="number" min='0' maxLength={7} onInput={(e) => maxLengthCheck(e)} onPaste={preventPasteNegative} onKeyPress={preventMinus} name="dirujukanPasienRujukan" className="form-control" value={dirujukanPasienRujukan} 
                        onChange={e => changeHandler(e)} />
                    </td>
                    <td>
                        <input type="number" min='0' maxLength={7} onInput={(e) => maxLengthCheck(e)} onPaste={preventPasteNegative} onKeyPress={preventMinus} name="dirujukPasienDatangSendiri" className="form-control" value={dirujukPasienDatangSendiri} 
                        onChange={e => changeHandler(e)} />
                    </td>
                    <td>
                        <input type="number" min='0' maxLength={7} onInput={(e) => maxLengthCheck(e)} onPaste={preventPasteNegative} onKeyPress={preventMinus} name="dirujukDiterimaKembali" className="form-control" value={dirujukDiterimaKembali} 
                        onChange={e => changeHandler(e)} />
                    </td>
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
 
export default FormUbahRL314