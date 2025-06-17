import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface MozoInfo {
  id: string;
  nombre: string;
  turno: string;
  mesasAsignadas: number[];
  activo: boolean;
}

export interface EstadisticasMozo {
  mesasAsignadas: number;
  mesasOcupadas: number;
  pedidosPendientes: number;
  ventasHoy: number;
}

@Injectable({
  providedIn: 'root'
})
export class MozoService {
  private mozoInfoSubject = new BehaviorSubject<MozoInfo>({
    id: '1',
    nombre: 'Juan Pérez',
    turno: 'Noche',
    mesasAsignadas: [1, 2, 3, 4, 5, 6],
    activo: true
  });

  private estadisticasSubject = new BehaviorSubject<EstadisticasMozo>({
    mesasAsignadas: 6,
    mesasOcupadas: 0,
    pedidosPendientes: 0,
    ventasHoy: 0
  });

  constructor() { }

  getMozoInfo(): Observable<MozoInfo> {
    return this.mozoInfoSubject.asObservable();
  }

  getEstadisticas(): Observable<EstadisticasMozo> {
    return this.estadisticasSubject.asObservable();
  }

  actualizarEstadisticas(estadisticas: EstadisticasMozo): void {
    this.estadisticasSubject.next(estadisticas);
  }

  cambiarTurno(nuevoTurno: string): void {
    const mozoActual = this.mozoInfoSubject.value;
    this.mozoInfoSubject.next({
      ...mozoActual,
      turno: nuevoTurno
    });
  }

  activarMozo(): void {
    const mozoActual = this.mozoInfoSubject.value;
    this.mozoInfoSubject.next({
      ...mozoActual,
      activo: true
    });
  }

  desactivarMozo(): void {
    const mozoActual = this.mozoInfoSubject.value;
    this.mozoInfoSubject.next({
      ...mozoActual,
      activo: false
    });
  }
}