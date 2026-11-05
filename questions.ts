export interface QuestionItem {
  id: number;
  letter: string;
  letterRule: 'starts' | 'contains';
  spanishQuestion: string;
  armenianQuestion: string;
  spanishAnswer: string;
  armenianAnswer: string;
  acceptedAnswers: string[];
  hint: string;
  armenianHint: string;
}

export const QUESTIONS_DATA: QuestionItem[] = [
  {
    id: 1,
    letter: 'A',
    letterRule: 'starts',
    spanishQuestion: '¿Qué soy? Soy una persona que te ayuda, te escucha y pasa tiempo contigo, aunque no sea de tu familia.',
    armenianQuestion: 'Ես մարդ եմ, ով քեզ օգնում է, լսում է և ժամանակ է անցկացնում քեզ հետ, թեև քո ընտանիքի անդամը չէ։',
    spanishAnswer: 'El amigo',
    armenianAnswer: 'Ընկեր',
    acceptedAnswers: ['amigo', 'el amigo', 'amiga', 'la amiga'],
    hint: 'Persona con la que se mantiene una relación de afecto y confianza.',
    armenianHint: 'Հավատարիմ մտերիմ մարդ:'
  },
  {
    id: 2,
    letter: 'B',
    letterRule: 'starts',
    spanishQuestion: '¿Qué soy? Tengo dos ruedas. Puedes utilizarme para ir al parque sin gastar gasolina.',
    armenianQuestion: 'Ես երկու անիվ ունեմ։ Կարող ես ինձ օգտագործել այգի գնալու համար՝ առանց բենզին ծախսելու։',
    spanishAnswer: 'La bicicleta',
    armenianAnswer: 'Հեծանիվ',
    acceptedAnswers: ['bicicleta', 'la bicicleta', 'bici', 'la bici'],
    hint: 'Vehículo de dos ruedas accionado por pedales.',
    armenianHint: 'Ոտնակներով շարժվող երկանիվ փոխադրամիջոց:'
  },
  {
    id: 3,
    letter: 'C',
    letterRule: 'starts',
    spanishQuestion: '¿Qué soy? Me necesitas cuando hace mucho frío. Me pongo encima de la ropa.',
    armenianQuestion: 'Ես քեզ պետք եմ, երբ շատ ցուրտ է։ Ինձ հագնում են հագուստի վրայից։',
    spanishAnswer: 'La chaqueta',
    armenianAnswer: 'Բաճկոն',
    acceptedAnswers: ['chaqueta', 'la chaqueta', 'abrigo', 'el abrigo', 'cazadora', 'la cazadora'],
    hint: 'Prenda de vestir de manga larga para abrigarse.',
    armenianHint: 'Տաք վերնահագուստ:'
  },
  {
    id: 4,
    letter: 'D',
    letterRule: 'starts',
    spanishQuestion: '¿Qué soy? Soy un objeto pequeño que el jugador lleva en la camiseta. Tengo un número y normalmente los aficionados me reconocen por él.',
    armenianQuestion: 'Ես փոքր նշան եմ մարզաշապիկի վրա։ Ցույց եմ տալիս խաղացողի համարը, և երկրպագուները հաճախ այդ համարով ճանաչում են նրան։',
    spanishAnswer: 'El dorsal',
    armenianAnswer: 'Մարզաշապիկի համար',
    acceptedAnswers: ['dorsal', 'el dorsal', 'numero', 'el numero', 'número', 'el número'],
    hint: 'Número identificativo en la espalda del uniforme deportivo.',
    armenianHint: 'Մարզիկի համազգեստի հետևի համարը:'
  },
  {
    id: 5,
    letter: 'E',
    letterRule: 'contains',
    spanishQuestion: '¿Qué soy? En un partido puedo cambiar el resultado. Aparezco cuando un jugador comete una infracción dentro de su propia área.',
    armenianQuestion: 'Խաղի ժամանակ կարող եմ փոխել հաշիվը։ Ինձ նշանակում են, երբ խաղացողը սեփական տուգանային հրապարակում կատարում է համապատասխան խախտում։',
    spanishAnswer: 'El penalti',
    armenianAnswer: 'Տասնմեկմետրանոց հարված',
    acceptedAnswers: ['penalti', 'el penalti', 'penalty', 'el penalty', 'penal', 'el penal'],
    hint: 'Máxima pena en el fútbol lanzada desde los once metros.',
    armenianHint: '11 մետրանոց տուգանային հարված ֆուտբոլում:'
  },
  {
    id: 6,
    letter: 'F',
    letterRule: 'contains',
    spanishQuestion: '¿Qué soy? Estoy en el campo de fútbol. Soy una red blanca que está detrás del portero. El balón entra en mí cuando marcan un gol.',
    armenianQuestion: 'Ես գտնվում եմ ֆուտբոլի խաղադաշտում։ Սպիտակ ցանց եմ՝ դարպասապահի հետևում։ Գոլ խփելիս գնդակը հայտնվում է իմ մեջ։',
    spanishAnswer: 'La red de la portería',
    armenianAnswer: 'Դարպասի ցանց',
    acceptedAnswers: [
      'red', 'la red', 'red de la porteria', 'la red de la porteria',
      'red de la portería', 'la red de la portería', 'red de porteria', 'red de portería'
    ],
    hint: 'Malla tejida colocada en la portería para retener el balón.',
    armenianHint: 'Դարպասին ամրացված հյուսվածք:'
  },
  {
    id: 7,
    letter: 'G',
    letterRule: 'starts',
    spanishQuestion: '¿Qué soy? Soy un animal que puede vivir en casa. Tengo bigotes, maúllo y me gusta dormir en lugares cómodos.',
    armenianQuestion: 'Ես կենդանի եմ, որը կարող է ապրել տանը։ Բեղեր ունեմ, մլավում եմ և սիրում եմ քնել հարմարավետ տեղերում։',
    spanishAnswer: 'El gato',
    armenianAnswer: 'Կատու',
    acceptedAnswers: ['gato', 'el gato', 'gata', 'la gata', 'felino', 'el felino'],
    hint: 'Felino doméstico de orejas puntiagudas que ronronea.',
    armenianHint: 'Մկներ բռնող ընտանի կենդանի:'
  },
  {
    id: 8,
    letter: 'H',
    letterRule: 'contains',
    spanishQuestion: '¿Qué soy? Puedes encontrarme en el colegio. Escribes en mis páginas y haces los deberes.',
    armenianQuestion: 'Ինձ կարող ես գտնել դպրոցում։ Իմ էջերում գրում ես և տնային աշխատանքներդ կատարում։',
    spanishAnswer: 'El cuaderno',
    armenianAnswer: 'Տետր',
    acceptedAnswers: ['cuaderno', 'el cuaderno', 'libreta', 'la libreta'],
    hint: 'Conjunto de hojas de papel grapadas para escribir notas.',
    armenianHint: 'Գրելու համար նախատեսված թղթերով կազմածո:'
  },
  {
    id: 9,
    letter: 'I',
    letterRule: 'contains',
    spanishQuestion: '¿Qué soy? Soy un objeto pequeño. Me utiliza el árbitro para detener el juego o señalar una falta. Hago un sonido fuerte.',
    armenianQuestion: 'Ես փոքր առարկա եմ։ Մրցավարն ինձ օգտագործում է խաղը կանգնեցնելու կամ խախտում արձանագրելու համար։ Բարձր ձայն եմ արձակում։',
    spanishAnswer: 'El silbato',
    armenianAnswer: 'Սուլիչ',
    acceptedAnswers: ['silbato', 'el silbato', 'pito', 'el pito'],
    hint: 'Instrumento que suena soplando en él.',
    armenianHint: 'Փչելով ձայն արձակող գործիք:'
  },
  {
    id: 10,
    letter: 'J',
    letterRule: 'contains',
    spanishQuestion: '¿Qué soy? Me utilizas para saber si llegas tarde al colegio o al entrenamiento.',
    armenianQuestion: 'Ինձ օգտագործում ես հասկանալու համար՝ ուշանո՞ւմ ես դպրոցից կամ մարզումից։',
    spanishAnswer: 'El reloj',
    armenianAnswer: 'Ժամացույց',
    acceptedAnswers: ['reloj', 'el reloj'],
    hint: 'Instrumento para medir el tiempo y las horas.',
    armenianHint: 'Ժամանակը ցույց տվող սարք:'
  },
  {
    id: 11,
    letter: 'K',
    letterRule: 'contains',
    spanishQuestion: '¿Qué soy? Soy un lugar donde puedes comprar comida, bebidas y productos para casa.',
    armenianQuestion: 'Ես վայր եմ, որտեղ կարող ես ուտելիք, խմիչք և տան համար անհրաժեշտ ապրանքներ գնել։',
    spanishAnswer: 'El supermercado',
    armenianAnswer: 'Սուպերմարկետ',
    acceptedAnswers: ['supermercado', 'el supermercado', 'super', 'el super', 'tienda', 'la tienda', 'mercado', 'el mercado'],
    hint: 'Establecimiento comercial de autoservicio de comestibles.',
    armenianHint: 'Առևտրի մեծ խանութ:'
  },
  {
    id: 12,
    letter: 'L',
    letterRule: 'starts',
    spanishQuestion: '¿Qué soy? Tengo muchas páginas, pero no soy una página web. Puedes aprender cosas nuevas conmigo.',
    armenianQuestion: 'Ես շատ էջեր ունեմ, բայց կայք չեմ։ Իմ միջոցով կարող ես նոր բաներ սովորել։',
    spanishAnswer: 'El libro',
    armenianAnswer: 'Գիրք',
    acceptedAnswers: ['libro', 'el libro'],
    hint: 'Conjunto de hojas de papel impresas encuadernadas.',
    armenianHint: 'Կազմված թերթերի ամբողջություն:'
  },
  {
    id: 13,
    letter: 'M',
    letterRule: 'starts',
    spanishQuestion: '¿Qué soy? Me usas todos los días para hablar con tus amigos, enviar mensajes y ver vídeos.',
    armenianQuestion: 'Դու ինձ օգտագործում ես ամեն օր՝ ընկերներիդ հետ խոսելու, հաղորդագրություններ ուղարկելու և տեսանյութեր դիտելու համար։',
    spanishAnswer: 'El móvil',
    armenianAnswer: 'Հեռախոս',
    acceptedAnswers: ['movil', 'el movil', 'el móvil', 'móvil', 'celular', 'el celular', 'telefono', 'teléfono', 'el telefono', 'el teléfono'],
    hint: 'Dispositivo electrónico portátil de comunicación.',
    armenianHint: 'Դյուրակիր կապի սարք:'
  },
  {
    id: 14,
    letter: 'N',
    letterRule: 'starts',
    spanishQuestion: '¿Qué soy? Tengo una puerta, pero no soy una habitación. Guardo la comida y mantengo frías las bebidas.',
    armenianQuestion: 'Ես դուռ ունեմ, բայց սենյակ չեմ։ Պահում եմ ուտելիքը և խմիչքները սառը։',
    spanishAnswer: 'La nevera',
    armenianAnswer: 'Սառնարան',
    acceptedAnswers: ['nevera', 'la nevera', 'frigorifico', 'el frigorifico', 'frigorífico', 'el frigorífico', 'refrigerador', 'el refrigerador'],
    hint: 'Electrodoméstico que mantiene fríos los alimentos.',
    armenianHint: 'Ուտելիքը թարմ պահող կենցաղային տեխնիկա:'
  },
  {
    id: 15,
    letter: 'Ñ',
    letterRule: 'contains',
    spanishQuestion: '¿Qué soy? Me necesitas para entrar en una cuenta. No debes compartirlo con desconocidos.',
    armenianQuestion: 'Ինձ անհրաժեշտ ես համարում քո հաշիվ մուտք գործելու համար։ Չպետք է ինձ հայտնես անծանոթներին։',
    spanishAnswer: 'La contraseña',
    armenianAnswer: 'Գաղտնաբառ',
    acceptedAnswers: ['contraseña', 'la contraseña', 'contrasena', 'la contrasena', 'password', 'clave', 'la clave'],
    hint: 'Clave secreta que permite el acceso a un sistema.',
    armenianHint: 'Գաղտնի նշաններ համակարգ մտնելու համար:'
  },
  {
    id: 16,
    letter: 'O',
    letterRule: 'starts',
    spanishQuestion: '¿Qué soy? Tengo una pantalla, un teclado y un ratón. Puedes utilizarme para estudiar, jugar y crear programas.',
    armenianQuestion: 'Ես էկրան, ստեղնաշար և մկնիկ ունեմ։ Ինձ կարող ես օգտագործել սովորելու, խաղալու և ծրագրեր ստեղծելու համար։',
    spanishAnswer: 'El ordenador',
    armenianAnswer: 'Համակարգիչ',
    acceptedAnswers: ['ordenador', 'el ordenador', 'computadora', 'la computadora', 'pc'],
    hint: 'Máquina electrónica para procesar información y ejecutar programas.',
    armenianHint: 'Էլեկտրոնային հաշվողական մեքենա:'
  },
  {
    id: 17,
    letter: 'P',
    letterRule: 'starts',
    spanishQuestion: '¿Qué soy? Tengo cuatro patas, ladro y me encanta jugar con una pelota.',
    armenianQuestion: 'Ես չորս թաթ ունեմ, հաչում եմ և շատ եմ սիրում գնդակով խաղալ։',
    spanishAnswer: 'El perro',
    armenianAnswer: 'Շուն',
    acceptedAnswers: ['perro', 'el perro', 'can', 'el can'],
    hint: 'El mejor amigo del hombre, animal doméstico que ladra.',
    armenianHint: 'Մարդու հավատարիմ բարեկամը:'
  },
  {
    id: 18,
    letter: 'Q',
    letterRule: 'contains',
    spanishQuestion: '¿Qué soy? Me utilizas para protegerte de la lluvia. Cuando deja de llover, puedes cerrarme.',
    armenianQuestion: 'Դու ինձ օգտագործում ես անձրևից պաշտպանվելու համար։ Երբ անձրևը դադարում է, կարող ես ինձ փակել։',
    spanishAnswer: 'El paraguas',
    armenianAnswer: 'Անձրևանոց',
    acceptedAnswers: ['paraguas', 'el paraguas'],
    hint: 'Aparato portátil para resguardarse del agua de lluvia.',
    armenianHint: 'Անձրևից պաշտպանվելու ծալովի իր:'
  },
  {
    id: 19,
    letter: 'R',
    letterRule: 'contains',
    spanishQuestion: '¿Qué soy? Puedes ganarme o perderme. En el fútbol hay dos equipos que intentan conseguir la victoria.',
    armenianQuestion: 'Դու կարող ես ինձ հաղթել կամ պարտվել։ Ֆուտբոլում երկու թիմ փորձում են հաղթանակի հասնել։',
    spanishAnswer: 'El partido',
    armenianAnswer: 'Հանդիպում / խաղ',
    acceptedAnswers: ['partido', 'el partido', 'partido de futbol', 'partido de fútbol', 'encuentro', 'el encuentro', 'juego', 'el juego'],
    hint: 'Competición deportiva entre dos equipos.',
    armenianHint: 'Մարզական մրցակցություն երկու թիմերի միջև:'
  },
  {
    id: 20,
    letter: 'S',
    letterRule: 'contains',
    spanishQuestion: '¿Qué soy? Me haces cuando envías el balón a un compañero de equipo.',
    armenianQuestion: 'Դու ինձ կատարում ես, երբ գնդակը ուղարկում ես թիմակցիդ։',
    spanishAnswer: 'El pase',
    armenianAnswer: 'Փոխանցում',
    acceptedAnswers: ['pase', 'el pase'],
    hint: 'Acción de entregar la pelota a un compañero.',
    armenianHint: 'Գնդակը խաղընկերոջը հասցնելու գործողություն:'
  },
  {
    id: 21,
    letter: 'T',
    letterRule: 'contains',
    spanishQuestion: '¿Qué soy? Estoy en el campo de fútbol. El portero intenta evitar que el balón entre en mí.',
    armenianQuestion: 'Ես գտնվում եմ ֆուտբոլի խաղադաշտում։ Դարպասապահը փորձում է թույլ չտալ, որ գնդակը հայտնվի իմ մեջ։',
    spanishAnswer: 'La portería',
    armenianAnswer: 'Դարպաս',
    acceptedAnswers: ['porteria', 'la porteria', 'portería', 'la portería', 'arco', 'el arco'],
    hint: 'Estructura delimitada por dos postes y un larguero con una red.',
    armenianHint: 'Ֆուտբոլային հրապարակի վերջնակետում գտնվող շրջանակ:'
  },
  {
    id: 22,
    letter: 'U',
    letterRule: 'contains',
    spanishQuestion: '¿Qué soy? Tengo cuatro ruedas y muchos asientos. Llevo a los pasajeros de una parada a otra.',
    armenianQuestion: 'Ես չորս կամ ավելի անիվ ունեմ և շատ նստատեղեր։ Ուղևորներին տեղափոխում եմ մի կանգառից մյուսը։',
    spanishAnswer: 'El autobús',
    armenianAnswer: 'Ավտոբուս',
    acceptedAnswers: ['autobus', 'el autobus', 'autobús', 'el autobús', 'bus', 'el bus'],
    hint: 'Vehículo grande de transporte colectivo terrestre.',
    armenianHint: 'Հասարակական տրանսպորտային միջոց:'
  },
  {
    id: 23,
    letter: 'V',
    letterRule: 'starts',
    spanishQuestion: '¿Qué soy? No puedes verme, pero puedes sentirme cuando corro entre los árboles.',
    armenianQuestion: 'Դու չես կարող ինձ տեսնել, բայց կարող ես զգալ, երբ անցնում եմ ծառերի միջով։',
    spanishAnswer: 'El viento',
    armenianAnswer: 'Քամի',
    acceptedAnswers: ['viento', 'el viento', 'aire', 'el aire'],
    hint: 'Corriente de aire producida en la atmósfera.',
    armenianHint: 'Օդի բնական հոսանք:'
  },
  {
    id: 24,
    letter: 'W',
    letterRule: 'contains',
    spanishQuestion: '¿Qué soy? Me utilizas cuando no sabes dónde estás y quieres encontrar el camino correcto.',
    armenianQuestion: 'Դու ինձ օգտագործում ես, երբ չգիտես՝ որտեղ ես գտնվում, և ուզում ես գտնել ճիշտ ճանապարհը։',
    spanishAnswer: 'El mapa',
    armenianAnswer: 'Քարտեզ',
    acceptedAnswers: ['mapa', 'el mapa', 'plano', 'el plano', 'gps'],
    hint: 'Representación geográfica de la Tierra o parte de ella en una superficie plana.',
    armenianHint: 'Տեղանքի գծագրական պատկերը:'
  },
  {
    id: 25,
    letter: 'X',
    letterRule: 'contains',
    spanishQuestion: '¿Qué soy? Soy un lugar donde los aviones despegan y aterrizan. Los pasajeros vienen aquí antes de viajar a otro país.',
    armenianQuestion: 'Ես վայր եմ, որտեղ ինքնաթիռները թռչում և վայրէջք են կատարում։ Ուղևորներն այստեղ են գալիս այլ երկիր մեկնելուց առաջ։',
    spanishAnswer: 'El aeropuerto',
    armenianAnswer: 'Օդանավակայան',
    acceptedAnswers: ['aeropuerto', 'el aeropuerto', 'aerodromo', 'el aerodromo'],
    hint: 'Instalación con pistas para el despegue y aterrizaje de aviones.',
    armenianHint: 'Ինքնաթիռների կայանատեղի:'
  },
  {
    id: 26,
    letter: 'Y',
    letterRule: 'contains',
    spanishQuestion: '¿Qué soy? Puedes perderme si no sabes dónde has puesto tus cosas. Me necesitas para abrir una puerta.',
    armenianQuestion: 'Դու կարող ես ինձ կորցնել, եթե չհիշես՝ որտեղ ես դրել իրերդ։ Ես քեզ պետք եմ դուռ բացելու համար։',
    spanishAnswer: 'La llave',
    armenianAnswer: 'Բանալի',
    acceptedAnswers: ['llave', 'la llave'],
    hint: 'Instrumento metálico para abrir o cerrar cerraduras.',
    armenianHint: 'Կողպեք բացելու մետաղյա իր:'
  },
  {
    id: 27,
    letter: 'Z',
    letterRule: 'contains',
    spanishQuestion: '¿Qué soy? Soy un objeto redondo que se utiliza en el fútbol. Los jugadores me golpean con los pies y el portero intenta atraparme.',
    armenianQuestion: 'Ես կլոր առարկա եմ, որն օգտագործվում է ֆուտբոլում։ Խաղացողներն ինձ հարվածում են ոտքերով, իսկ դարպասապահը փորձում է բռնել ինձ։',
    spanishAnswer: 'El balón',
    armenianAnswer: 'Գնդակ',
    acceptedAnswers: ['balon', 'el balon', 'balón', 'el balón', 'pelota', 'la pelota', 'esfera', 'la esfera'],
    hint: 'Pelota esférica inflable para jugar al fútbol.',
    armenianHint: 'Կլոր խաղային առարկա:'
  }
];

export function normalizeSpanish(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/^(el|la|los|las|un|una)\s+/, '') // remove articles for easy matching
    .replace(/[^a-z0-9ñ]/gi, ''); // clean punctuation
}

export function checkAnswerMatch(userInput: string, question: QuestionItem): boolean {
  if (!userInput.trim()) return false;
  const normalizedUser = normalizeSpanish(userInput);
  
  // Direct check against accepted variants
  for (const variant of question.acceptedAnswers) {
    if (normalizeSpanish(variant) === normalizedUser) {
      return true;
    }
  }

  // Also check direct answer
  if (normalizeSpanish(question.spanishAnswer) === normalizedUser) {
    return true;
  }

  return false;
}
