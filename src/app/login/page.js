"use client";
// Next
import { useRouter } from "next/navigation";
import Image from "next/image";

//Context
import { useUserContext } from "@/contexts/user";

//React
import { useState } from "react";

//Componentes
import Button from "@/components_UI/Button";
import Input from "@/components_UI/Input";
import Loader from "@/components_UI/Loader";

export default function Page() {
  const { logIn, handleUser } = useUserContext();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const log = async (e) => {
    setLoading(true);
    const result = await logIn(e);
    setLoading(false);
    if (result) {
      router.push("/");
    } else setError(true);
  }

  return (
    <div className="c-login">
      <div className="c-login__card">
        <div className="c-login__marca">
          <img src={'/innova/imagenes/iso.png'}/>
          <div>
            <span className="u-color--primary">IN</span><span>NOVA</span>
          </div>
        </div>
        <div className="c-login__form">
          <p>Usuario:</p>
          <Input
            OnKeyUp={(e) => {
              if (e.key === "Enter") log(e);
            }}
            handleChange={(val) => handleUser("username", val)}
          />
          <p>Contraseña:</p>
          <Input
            OnKeyUp={(e) => {
              if (e.key === "Enter") log(e);
            }}
            type={"password"}
            handleChange={(val) => handleUser("password", val)}
          />
          {error ? (
            <span className="u-color--red u-text--bold">
              Credenciales incorrectas.
            </span>
          ) : (
            ""
          )}
          {loading ? (
            <div>
              <Loader />
            </div>
          ) : (
            <Button text={"Ingresar"} clickHandler={(e) => log(e)} />
          )}
          <p className="u-cursor--pointer u-text_align--center u-m3--top">¿Olvidaste tu usuario?</p>
        </div>
      </div>
    </div>
  );
}
