import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate, Link } from "react-router-dom";
import style from "./FormTambahRL38.module.css";
import { HiSaveAs } from "react-icons/hi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { confirmAlert } from "react-confirm-alert";
import { RiDeleteBin5Fill, RiEdit2Fill } from "react-icons/ri";
import { AiFillFileAdd } from "react-icons/ai";
import { Spinner, Table } from "react-bootstrap";

const RL38 = () => {
  const [tahun, setTahun] = useState("");
  const [namaRS, setNamaRS] = useState("");
  const [alamatRS, setAlamatRS] = useState("");
  const [namaPropinsi, setNamaPropinsi] = useState("");
  const [namaKabKota, setNamaKabKota] = useState("");
  const [dataRL, setDataRL] = useState([]);
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [spinner, setSpinner] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
    const getLastYear = async () => {
      const date = new Date();
      setTahun(date.getFullYear() - 1);
      return date.getFullYear() - 1;
    };
    getLastYear().then((results) => {
      getDataRLTigaTitikDelapan(results);
    });

    // getRLTigaTitikdelapanTemplate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get("/apisirs/token");
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setExpire(decoded.exp);
      getDataRS(decoded.rsId);
    } catch (error) {
      if (error.response) {
        navigate("/");
      }
    }
  };

  const axiosJWT = axios.create();
  axiosJWT.interceptors.request.use(
    async (config) => {
      const currentDate = new Date();
      if (expire * 1000 < currentDate.getTime()) {
        const response = await axios.get("/apisirs/token");
        config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        setToken(response.data.accessToken);
        const decoded = jwt_decode(response.data.accessToken);
        setExpire(decoded.exp);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const getDataRS = async (id) => {
    try {
      const response = await axiosJWT.get("/apisirs/rumahsakit/" + id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(response.data);
      setNamaRS(response.data.data[0].nama);
      setAlamatRS(response.data.data[0].alamat);
      setNamaPropinsi(response.data.data[0].propinsi.nama);
      setNamaKabKota(response.data.data[0].kabKota.nama);
    } catch (error) {}
  };

  const changeHandlerSingle = (event) => {
    setTahun(event.target.value);
  };

  const getDataRLTigaTitikDelapan = async (event) => {
    setSpinner(true);
    try {
      const customConfig = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: {
          tahun: event,
        },
      };

      const detailkegiatan = await axiosJWT.get(
        "/apisirs/rltigatitikdelapan",
        customConfig
      );

      const rlTemplate = detailkegiatan.data.data.map((value, index) => {
        return {
          id: value.id,
          groupId:
            value.jenis_kegiatan.group_jenis_kegiatan
              .group_jenis_kegiatan_header.id,
          groupNama:
            value.jenis_kegiatan.group_jenis_kegiatan
              .group_jenis_kegiatan_header.nama,
          subGroupId: value.jenis_kegiatan.group_jenis_kegiatan.id,
          subGroupNo: value.jenis_kegiatan.group_jenis_kegiatan.no,
          subGroupNama: value.jenis_kegiatan.group_jenis_kegiatan.nama,
          jenisKegiatanId: value.jenis_kegiatan.id,
          jenisKegiatanNo: value.jenis_kegiatan.no,
          jenisKegiatanNama: value.jenis_kegiatan.nama,
          nilai: value.jumlah,
        };
      });

      let subGroups = [];
      rlTemplate.reduce(function (res, value) {
        if (!res[value.subGroupId]) {
          res[value.subGroupId] = {
            groupId: value.groupId,
            groupNama: value.groupNama,
            subGroupId: value.subGroupId,
            subGroupNo: value.subGroupNo,
            subGroupNama: value.subGroupNama,
            subGroupNilai: 0,
          };
          subGroups.push(res[value.subGroupId]);
        }
        res[value.subGroupId].subGroupNilai += value.nilai;
        return res;
      }, {});

      let groups = [];
      subGroups.reduce(function (res, value) {
        if (!res[value.groupId]) {
          res[value.groupId] = {
            groupId: value.groupId,
            groupNama: value.groupNama,
            groupNilai: 0,
          };
          groups.push(res[value.groupId]);
        }
        res[value.groupId].groupNilai += value.subGroupNilai;
        return res;
      }, {});

      let satu = [];
      let dua = [];

      subGroups.forEach((element2) => {
        const filterData2 = rlTemplate.filter((value2, index2) => {
          return value2.subGroupId === element2.subGroupId;
        });
        dua.push({
          groupId: element2.groupId,
          subGroupId: element2.subGroupId,
          subGroupNo: element2.subGroupNo,
          subGroupNama: element2.subGroupNama,
          subGroupNilai: element2.subGroupNilai,
          kegiatan: filterData2,
        });
      });

      groups.forEach((element) => {
        const filterData = dua.filter((value, index) => {
          return value.groupId === element.groupId;
        });
        satu.push({
          groupId: element.groupId,
          groupNama: element.groupNama,
          groupNilai: element.groupNilai,
          details: filterData,
        });
      });

      console.log(satu);

      setDataRL(satu);
      setSpinner(false);
    } catch (error) {
      console.log(error);
    }
  };

  const Cari = async (e) => {
    e.preventDefault();
    setSpinner(true);
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
      const detailkegiatan = await axiosJWT.get(
        "/apisirs/rltigatitikdelapan",
        customConfig
      );

      const rlTemplate = detailkegiatan.data.data.map((value, index) => {
        return {
          id: value.id,
          groupId:
            value.jenis_kegiatan.group_jenis_kegiatan
              .group_jenis_kegiatan_header.id,
          groupNama:
            value.jenis_kegiatan.group_jenis_kegiatan
              .group_jenis_kegiatan_header.nama,
          subGroupId: value.jenis_kegiatan.group_jenis_kegiatan.id,
          subGroupNo: value.jenis_kegiatan.group_jenis_kegiatan.no,
          subGroupNama: value.jenis_kegiatan.group_jenis_kegiatan.nama,
          jenisKegiatanId: value.jenis_kegiatan.id,
          jenisKegiatanNo: value.jenis_kegiatan.no,
          jenisKegiatanNama: value.jenis_kegiatan.nama,
          nilai: value.jumlah,
        };
      });

      let subGroups = [];
      rlTemplate.reduce(function (res, value) {
        if (!res[value.subGroupId]) {
          res[value.subGroupId] = {
            groupId: value.groupId,
            groupNama: value.groupNama,
            subGroupId: value.subGroupId,
            subGroupNo: value.subGroupNo,
            subGroupNama: value.subGroupNama,
            subGroupNilai: 0,
          };
          subGroups.push(res[value.subGroupId]);
        }
        res[value.subGroupId].subGroupNilai += value.nilai;
        return res;
      }, {});

      let groups = [];
      subGroups.reduce(function (res, value) {
        if (!res[value.groupId]) {
          res[value.groupId] = {
            groupId: value.groupId,
            groupNama: value.groupNama,
            groupNilai: 0,
          };
          groups.push(res[value.groupId]);
        }
        res[value.groupId].groupNilai += value.subGroupNilai;
        return res;
      }, {});

      let satu = [];
      let dua = [];

      subGroups.forEach((element2) => {
        const filterData2 = rlTemplate.filter((value2, index2) => {
          return value2.subGroupId === element2.subGroupId;
        });
        dua.push({
          groupId: element2.groupId,
          subGroupId: element2.subGroupId,
          subGroupNo: element2.subGroupNo,
          subGroupNama: element2.subGroupNama,
          subGroupNilai: element2.subGroupNilai,
          kegiatan: filterData2,
        });
      });

      groups.forEach((element) => {
        const filterData = dua.filter((value, index) => {
          return value.groupId === element.groupId;
        });
        satu.push({
          groupId: element.groupId,
          groupNama: element.groupNama,
          groupNilai: element.groupNilai,
          details: filterData,
        });
      });

      // console.log(satu);

      setDataRL(satu);
      setSpinner(false);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteRL38 = async (id) => {
    const customConfig = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      await axiosJWT.delete(`/apisirs/rltigatitikdelapan/${id}`, customConfig);
      window.location.reload(false);
      toast("Data Berhasil Dihapus", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.log(error);
      toast("Data Gagal Dihapus", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const confirmationDelete = (id) => {
    confirmAlert({
      title: "Konfirmasi Penghapusan",
      message: "Apakah Anda Yakin ?",
      buttons: [
        {
          label: "Ya",
          onClick: () => {
            deleteRL38(id);
          },
        },
        {
          label: "Tidak",
        },
      ],
    });
  };
  return (
    <div className="container" style={{ marginTop: "70px" }}>
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title h5">Profile Fasyankes</h5>
              <div
                className="form-floating"
                style={{ width: "100%", display: "inline-block" }}
              >
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  value={namaRS}
                  disabled={true}
                />
                <label htmlFor="floatingInput">Nama</label>
              </div>
              <div
                className="form-floating"
                style={{ width: "100%", display: "inline-block" }}
              >
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  value={alamatRS}
                  disabled={true}
                />
                <label htmlFor="floatingInput">Alamat</label>
              </div>
              <div
                className="form-floating"
                style={{ width: "50%", display: "inline-block" }}
              >
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  value={namaPropinsi}
                  disabled={true}
                />
                <label htmlFor="floatingInput">Provinsi </label>
              </div>
              <div
                className="form-floating"
                style={{ width: "50%", display: "inline-block" }}
              >
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  value={namaKabKota}
                  disabled={true}
                />
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
                <div
                  className="form-floating"
                  style={{ width: "100%", display: "inline-block" }}
                >
                  <input
                    name="tahun"
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    placeholder="Tahun"
                    value={tahun}
                    onChange={(e) => changeHandlerSingle(e)}
                    // disabled={true}
                  />
                  <label htmlFor="floatingInput">Tahun</label>
                </div>
                <div className="mt-3 mb-3">
                  <button type="submit" className="btn btn-outline-success">
                    <HiSaveAs /> Cari
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-3 mb-3">
        <div className="col-md-12">
          <Link to={`/rl38/tambah/`} style={{ textDecoration: "none" }}>
            <AiFillFileAdd
              size={30}
              style={{ color: "gray", cursor: "pointer" }}
            />
            <span style={{ color: "gray" }}>RL 3.8 LABORATORIUM</span>
          </Link>
          <div className="container" style={{ textAlign: "center" }}>
            {/* <h5>test</h5> */}
            {spinner && <Spinner animation="grow" variant="success"></Spinner>}
            {spinner && <Spinner animation="grow" variant="success"></Spinner>}
            {spinner && <Spinner animation="grow" variant="success"></Spinner>}
            {spinner && <Spinner animation="grow" variant="success"></Spinner>}
            {spinner && <Spinner animation="grow" variant="success"></Spinner>}
            {spinner && <Spinner animation="grow" variant="success"></Spinner>}
          </div>
          <Table
            className={style.rlTable}
            responsive
            bordered
            style={{ widows: "100%" }}
          >
            <thead>
              <tr>
                <th style={{ width: "4%" }}>No Kegiatan</th>
                <th style={{ width: "5%" }}>Action</th>
                <th style={{ width: "40%" }}>Jenis Kegiatan</th>
                <th style={{ width: "40%" }}>Jumlah</th>
              </tr>
            </thead>
            <tbody>
              {dataRL.map((value, index) => {
                return (
                  <React.Fragment key={index}>
                    <tr
                      style={{
                        textAlign: "center",
                        backgroundColor: "#C4DFAA",
                        fontWeight: "bold",
                        // color:"#354259"
                      }}
                    >
                      <td>{value.groupId}</td>
                      <td></td>
                      <td>{value.groupNama}</td>
                      <td>{value.groupNilai}</td>
                    </tr>
                    {value.details.map((value2, index2) => {
                      return (
                        <React.Fragment key={index2}>
                          <tr
                            style={{
                              textAlign: "center",
                              backgroundColor: "#90C8AC",
                              fontWeight: "bold",
                              // color:"#354259"
                            }}
                          >
                            <td>{value2.subGroupNo}</td>
                            <td></td>
                            <td>{value2.subGroupNama}</td>
                            <td>{value2.subGroupNilai}</td>
                          </tr>
                          {value2.kegiatan.map((value3, index3) => {
                            return (
                              <tr
                                key={index3}
                                style={{
                                  textAlign: "center",
                                  fontWeight: "bold",
                                }}
                              >
                                <td>{value3.jenisKegiatanNo}</td>
                                <td>
                                  <ToastContainer />
                                  <RiDeleteBin5Fill
                                    size={20}
                                    onClick={(e) =>
                                      confirmationDelete(value3.id)
                                    }
                                    style={{
                                      color: "gray",
                                      cursor: "pointer",
                                      marginRight: "5px",
                                    }}
                                  />
                                  <Link to={`/rl38/ubah/${value3.id}`}>
                                    <RiEdit2Fill
                                      size={20}
                                      style={{
                                        color: "gray",
                                        cursor: "pointer",
                                      }}
                                    />
                                  </Link>
                                </td>
                                <td>{value3.jenisKegiatanNama}</td>
                                <td>{value3.nilai}</td>
                              </tr>
                            );
                          })}
                        </React.Fragment>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default RL38;