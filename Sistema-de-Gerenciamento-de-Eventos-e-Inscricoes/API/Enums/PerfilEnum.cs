using System;
using System.Text.Json.Serialization;

namespace API.Enums;

// Enums de Turno
[JsonConverter(typeof(JsonStringEnumConverter))]
public enum PerfilEnum
{
    Participante,
    Organizador
}
