
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cursos } from '../cursos';
import { CursosService } from '../cursos.service';


@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.css']
})
export class CursosComponent implements OnInit {

  Titulo = 'Cursos';

  TituloAccionABMC = {
    M: '(Modificar)',
    L: '(Listado)'
  };

  AccionABMC = 'L'; // Inicia en el listado de articulos

  Mensajes = {
    SD: 'No se encontraron registros...',
    RD: 'Revisar los datos ingresados...'
  };

  Items: Cursos[] = [];

  FormModificar: FormGroup;
  submitted: boolean;

  OpcionesActivo =
  [
    {Id: true, Nombre: 'SI'},
    {Id: false, Nombre: 'NO'}
  ];

  constructor(
    private cursosService: CursosService,
    public formBuilder: FormBuilder,
    ) {}

  ngOnInit(): void {
    this.FormModificar = this.formBuilder.group({
      id: ['', [Validators.required, Validators.pattern('[0-9]{1,10}')]],
      nombre: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      cupo: ['', [Validators.required, Validators.pattern('[0-9]{1,5}')]],
      fecha: ['', [Validators.required, Validators.pattern('(0[1-9]|[12][0-9]|3[01])[-/](0[1-9]|1[012])[-/](19|20|21|22|23)[0-9]{2}')]],
      vigente: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],

    });
    this.submitted = false;
    this.Buscar();
  }

  // Buscar segun filtros establecidos en FormRegistro
  Buscar()
  {
    this.cursosService.get().
      subscribe((res: any) =>
      {
        this.Items = res;
      });
  }

  BuscarPorId(item, AccionABMC): void
  {
    window.scroll(0, 0); // ir al inicio del scroll
    this.cursosService.getById(item.id).subscribe((res: any) =>
    {
      console.log(res);
      const itemCopy = { ...res}; // hace una copia para no modificar el array mockeado
      let arrFecha = itemCopy.fecha.substr(0, 10).split('-'); //conversiones de fecha...
      itemCopy.fecha = arrFecha[2] + '/' + arrFecha[1] + '/' + arrFecha[0];
      
      this.FormModificar.patchValue(itemCopy);
      this.AccionABMC = AccionABMC;
    });
  }

  Modificar(item): void
  {
    this.submitted = false;
    this.FormModificar.markAsUntouched();
    this.BuscarPorId(item, 'M');
  }

  Grabar(): void
  {
    this.submitted = true;
    if(this.FormModificar.invalid) return;
    const copiaCurso = {...this.FormModificar.value};
    const arrFecha = copiaCurso.fecha.substr(0, 10).split('/');
    if (arrFecha.length === 3)
    {
      copiaCurso.fecha = new Date(arrFecha[2], arrFecha[1], arrFecha[0]).toISOString();
    }
    this.cursosService.put(copiaCurso.id, copiaCurso).subscribe((res: any) =>
    {
      this.Volver();
      alert('El articulo se actualizo correctamente');
      this.Buscar();
    });
  }


  // Volver desde Agregar/Modificar
    Volver(): void
    {
      this.AccionABMC = 'L';
    }

}


