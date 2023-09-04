import React, { useState, useEffect } from "react"
import axios from "axios"
import jwt_decode from 'jwt-decode'
import { useNavigate, useParams } from "react-router-dom"
import style from './FormTambahRL32.module.css'
import { HiSaveAs } from 'react-icons/hi'
import { IoArrowBack } from 'react-icons/io5'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom'

export const FormUbahRL32 = () => {
    const [tahun, setTahun] = useState('')
    const [namaRS, setNamaRS] = useState('')
    const [alamatRS, setAlamatRS] = useState('')
    const [namaPropinsi, setNamaPropinsi] = useState('')
    const [namaKabKota, setNamaKabKota] = useState('')
    const [jenisPelayanan, setJenisPelayanan] = useState('')
    const [totalPasienRujukan, settotalPasienRujukan] = useState('')
    const [totalPasienNonRujukan, settotalPasienNonRujukan] = useState('')
    const [tindakLanjutPelayananDirawat, settindakLanjutPelayananDirawat] = useState('')
    const [tindakLanjutPelayananDirujuk, settindakLanjutPelayananDirujuk] = useState('')
    const [tindakLanjutPelayananPulang, settindakLanjutPelayananPulang] = useState('')
    const [matiDiUGD, setmatiDiUGD] = useState('')
    const [doa, setdoa] = useState('')
    const [token, setToken] = useState('')
    const [expire, setExpire] = useState('')
    const navigate = useNavigate()
    const { id } = useParams();
    
    useEffect(() => {
        refreshToken()
        getDataRLTigaTitikDuaDetailById(id)
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
 
    const getDataRLTigaTitikDuaDetailById = async (id) => {
        try {
            const response = await axiosJWT.get('/apisirs/rltigatitikduadetail/' + id, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            // console.log(response.data.data[0])
            setJenisPelayanan(response.data.data[0].jenis_pelayanan.nama)
            settotalPasienRujukan(response.data.data[0].total_pasien_rujukan)
            settotalPasienNonRujukan(response.data.data[0].total_pasien_non_rujukan)
            settindakLanjutPelayananDirawat(response.data.data[0].tindak_lanjut_pelayanan_dirawat)
            settindakLanjutPelayananDirujuk(response.data.data[0].tindak_lanjut_pelayanan_dirujuk)
            settindakLanjutPelayananPulang(response.data.data[0].tindak_lanjut_pelayanan_pulang)
            setmatiDiUGD(response.data.data[0].mati_di_ugd)
            setdoa(response.data.data[0].doa)
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
            case "totalPasienRujukan":
                settotalPasienRujukan(event.target.value)
                break
            case "totalPasienNonRujukan":
                settotalPasienNonRujukan(event.target.value)
                break
            case "tindakLanjutPelayananDirawat":
                settindakLanjutPelayananDirawat(event.target.value)
                break
            case "tindakLanjutPelayananDirujuk":
                settindakLanjutPelayananDirujuk(event.target.value)
                break
            case "tindakLanjutPelayananPulang":
                settindakLanjutPelayananPulang(event.target.value)
                break
            case "matiDiUGD":
                setmatiDiUGD(event.target.value)
                break
            case "doa":
                setdoa(event.target.value)
                break
        }
        
    }

    const Simpan = async (e) => {
        e.preventDefault()
        try {
            const data = {
                "totalPasienRujukan": parseInt(totalPasienRujukan),
                "totalPasienNonRujukan": parseInt(totalPasienNonRujukan),
                "tindakLanjutPelayananDirawat": parseInt(tindakLanjutPelayananDirawat),
                "tindakLanjutPelayananDirujuk": parseInt(tindakLanjutPelayananDirujuk),
                "tindakLanjutPelayananPulang": parseInt(tindakLanjutPelayananPulang),
                "matiDiUGD": parseInt(matiDiUGD),
                "doa": parseInt(doa)
            }

            const customConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }

            const result = await axiosJWT.patch('/apisirs/rltigatitikduadetail/' + id, data, customConfig)
            
            toast('Data Berhasil Diubah', {
                position: toast.POSITION.TOP_RIGHT
            })
            setTimeout(() => {
                navigate('/rl32')
            }, 1000);
        } catch (error) {
            console.log(error)
            toast('Data Gagal Disimpan ' + error.response.data.message, {
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
                                        value= { namaKabKota } disabled={true}/>
                                    <label htmlFor="floatingInput">Kab/Kota</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-md-12">
                        {/* <Link to={`/rl32/`} style={{textDecoration: "none"}}>
                            <IoArrowBack size={30} style={{color:"gray",cursor: "pointer"}}/><span style={{color: "gray"}}>RL 3.2 Rawat Darurat</span>
                        </Link> */}
                        <Link to={`/rl32/`} className='btn btn-info' style={{fontSize:"18px", backgroundColor: "#779D9E", color: "#FFFFFF"}}>
                            {/* <IoArrowBack size={30} style={{color:"gray",cursor: "pointer"}}/> */}
                            &lt;
                        </Link>
                        <span style={{color: "gray"}}>Kembali RL 3.2 Rawat Darurat</span>
                        <table className={style.rlTable}>
                            <thead>
                                <tr>
                                    <th style={{"width": "4%"}}>No.</th>
                                    {/* <th style={{"width": "5%"}}></th> */}
                                    <th style={{"width": "20%"}}>Jenis Pelayanan</th>
                                    <th>Total Pasien Rujukan</th>
                                    <th>Total Pasien Non Rujukan</th>
                                    <th>Tindak Lanjut Pelayanan Dirawat</th>
                                    <th>Tindak Lanjut Pelayanan Dirujuk</th>
                                    {/* <th>Tindak Lanjut Pelayanan Pulang</th> */}
                                    <th>Mati Di UGD</th>
                                    <th>DOA</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <input type='text' name='id' className="form-control" value="1" disabled={true}/>
                                    </td>
                                    <td>
                                        <input type="text" name="jenisPelayanan" className="form-control" value={jenisPelayanan} disabled={true} />
                                    </td>
                                    <td>
                                        <input type="number" min='0' maxLength={7} onInput={(e) => maxLengthCheck(e)} onPaste={preventPasteNegative} onKeyPress={preventMinus} name="totalPasienRujukan" className="form-control" value={totalPasienRujukan} 
                                            onChange={event => changeHandler(event)} disabled={false} />
                                    </td>
                                    <td>
                                        <input type="number" min='0' maxLength={7} onInput={(e) => maxLengthCheck(e)} onPaste={preventPasteNegative} onKeyPress={preventMinus} name="totalPasienNonRujukan" className="form-control" value={totalPasienNonRujukan} 
                                            onChange={event => changeHandler(event)} disabled={false} />
                                    </td>
                                    <td>
                                        <input type="number" min='0' maxLength={7} onInput={(e) => maxLengthCheck(e)} onPaste={preventPasteNegative} onKeyPress={preventMinus} name="tindakLanjutPelayananDirawat" className="form-control" value={tindakLanjutPelayananDirawat} 
                                            onChange={event => changeHandler(event)} disabled={false} />
                                    </td>
                                    <td>
                                        <input type="number" min='0' maxLength={7} onInput={(e) => maxLengthCheck(e)} onPaste={preventPasteNegative} onKeyPress={preventMinus} name="tindakLanjutPelayananDirujuk" className="form-control" value={tindakLanjutPelayananDirujuk} 
                                            onChange={event => changeHandler(event)} disabled={false} />
                                    </td>
                                    {/* <td>
                                        <input type="number" min='0' onPaste={preventPasteNegative} onKeyPress={preventMinus} name="tindakLanjutPelayananPulang" className="form-control" value={tindakLanjutPelayananPulang} 
                                            onChange={event => changeHandler(event)} disabled={false} />
                                    </td> */}
                                    <td>
                                        <input type="number" min='0' maxLength={7} onInput={(e) => maxLengthCheck(e)} onPaste={preventPasteNegative} onKeyPress={preventMinus} name="matiDiUGD" className="form-control" value={matiDiUGD} 
                                            onChange={event => changeHandler(event)} disabled={false} />
                                    </td>
                                    <td>
                                        <input type="number" min='0' maxLength={7} onInput={(e) => maxLengthCheck(e)} onPaste={preventPasteNegative} onKeyPress={preventMinus} name="doa" className="form-control" value={doa} 
                                            onChange={event => changeHandler(event)} disabled={false} />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="mt-3 mb-3">
                    <ToastContainer />
                    <button type="submit" className="btn btn-outline-success"><HiSaveAs/> Simpan</button>
                </div>
            </form>
            
        </div>
    )
}

export default FormUbahRL32